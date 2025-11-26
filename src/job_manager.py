from typing import List, Optional

from .models import Job


class JobManager:
    def __init__(self) -> None:
        self.jobs: List[Job] = []

    def add(self, job: Job) -> None:
        if any(existing.id == job.id for existing in self.jobs):
            raise ValueError(f"作业 ID {job.id} 已存在")
        self.jobs.append(job)

    def get(self, job_id: str) -> Optional[Job]:
        for job in self.jobs:
            if job.id == job_id:
                return job
        return None

    def pop_next(self) -> Optional[Job]:
        return self.jobs.pop(0) if self.jobs else None

    def pending(self) -> List[Job]:
        return list(self.jobs)

