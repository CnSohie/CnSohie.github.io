from dataclasses import dataclass
from typing import List, Optional


def _require_positive(value: int, name: str) -> int:
    if value <= 0:
        raise ValueError(f"{name} must be positive")
    return value


@dataclass
class Partition:
    id: int
    start: int
    size: int
    is_free: bool = True
    job_id: Optional[str] = None

    def can_allocate(self, required: int) -> bool:
        return self.is_free and self.size >= required


@dataclass
class Job:
    id: str
    name: str
    required_size: int
    arrival_time: Optional[int] = None

    def __post_init__(self) -> None:
        _require_positive(self.required_size, "required_size")


@dataclass
class ExperimentResult:
    strategy: str
    allocated_jobs: int
    failed_jobs: int
    free_partitions: int
    external_fragmentation: int
    utilization: float

    def as_row(self) -> str:
        util_percent = f"{self.utilization * 100:.1f}%"
        return (
            f"{self.strategy:10} | Allocated: {self.allocated_jobs:2d} | "
            f"Failed: {self.failed_jobs:2d} | Free blocks: {self.free_partitions:2d} | "
            f"Fragmentation: {self.external_fragmentation:4d} KB | Utilization: {util_percent}"
        )


def clone_jobs(jobs: List[Job]) -> List[Job]:
    return [Job(j.id, j.name, j.required_size, j.arrival_time) for j in jobs]

