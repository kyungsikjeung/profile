"""Kafka 변환 이벤트 발행 (best-effort: 브로커가 없어도 무시).

실습 포인트: 토픽 `conversion-events`에 job 생애주기(created/done/failed)를
JSON으로 발행. 컨슈머 예제는 `backend/scripts/consume_events.py`.
"""

import json

import structlog

from app.config import settings

log = structlog.get_logger()

TOPIC = "conversion-events"

_producer = None
_started = False


async def _get_producer():
    global _producer, _started
    if _producer is not None:
        return _producer
    if _started:
        return None
    _started = True
    try:
        from aiokafka import AIOKafkaProducer

        p = AIOKafkaProducer(
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            request_timeout_ms=2000,
        )
        await p.start()
        _producer = p
        return p
    except Exception as exc:  # noqa: BLE001 — 카프카 없어도 앱은 정상 동작
        log.warning("kafka unavailable, events disabled", error=str(exc))
        return None


async def publish(event: dict) -> None:
    """이벤트 1건 발행. 실패해도 호출자에게 예외를 전파하지 않음."""
    try:
        producer = await _get_producer()
        if producer is None:
            return
        await producer.send_and_wait(TOPIC, json.dumps(event, default=str).encode())
    except Exception as exc:  # noqa: BLE001
        log.warning("kafka publish failed", topic=TOPIC, error=str(exc))
