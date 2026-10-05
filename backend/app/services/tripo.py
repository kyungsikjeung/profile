"""Tripo3D 프로바이더.

Tripo v2 API는 파일 업로드 후 file_token을 받아 태스크를 생성하는
플로우라서, 토큰 발급·서명 업로드 연동이 별도로 필요하다.
CONVERSION_PROVIDER=tripo 선택 시 아래 함수가 호출되며,
업로드 플로우가 구현될 때까지 명확한 에러를 반환한다 (조용한 mock 폴백 금지).
"""


async def create_task(image_url: str, options: dict) -> str:
    raise NotImplementedError(
        "Tripo 연동은 file_token 업로드 플로우 구현 후 활성화됩니다. "
        "당분간 CONVERSION_PROVIDER=meshy 또는 mock을 사용하세요."
    )


async def get_task(task_id: str) -> dict:
    raise NotImplementedError("Tripo 연동 준비 중입니다.")


async def download_glb(url: str, dest_name: str) -> str:
    raise NotImplementedError("Tripo 연동 준비 중입니다.")
