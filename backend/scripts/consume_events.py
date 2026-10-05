"""실습용 Kafka 컨슈머: conversion-events 토픽을 표준 출력으로 덤프.

실행 (백엔드 디렉토리에서):
    .venv/bin/python scripts/consume_events.py

변환 요청을 보내면 created → done/failed 이벤트가 찍힌다.
종료: Ctrl+C
"""

import asyncio
import json

from aiokafka import AIOKafkaConsumer


async def main() -> None:
    consumer = AIOKafkaConsumer(
        "conversion-events",
        bootstrap_servers="localhost:9092",
        auto_offset_reset="earliest",
        enable_auto_commit=True,
    )
    await consumer.start()
    print("listening: conversion-events (Ctrl+C to stop)")
    try:
        async for msg in consumer:
            print(f"[{msg.topic} p{msg.partition} o{msg.offset}] {json.loads(msg.value)}")
    finally:
        await consumer.stop()


if __name__ == "__main__":
    asyncio.run(main())
