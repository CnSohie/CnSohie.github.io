from typing import List

from .memory_manager import MemoryManager
from .models import ExperimentResult, Job, Partition, clone_jobs
from .strategies import AllocationStrategy


class ExperimentManager:
    def __init__(self, total_memory: int) -> None:
        self.total_memory = total_memory

    def run_single(self, strategy: AllocationStrategy, jobs: List[Job]) -> ExperimentResult:
        manager = MemoryManager(self.total_memory, strategy)
        successes = 0
        failures = 0
        for job in clone_jobs(jobs):
            if manager.allocate(job):
                successes += 1
            else:
                failures += 1
        fragmentation, free_blocks = manager.free_statistics()
        utilization = manager.utilization()
        return ExperimentResult(
            strategy=strategy.name,
            allocated_jobs=successes,
            failed_jobs=failures,
            free_partitions=free_blocks,
            external_fragmentation=fragmentation,
            utilization=utilization,
        )

    def compare_strategies(
        self, strategies: List[AllocationStrategy], jobs: List[Job]
    ) -> List[ExperimentResult]:
        results: List[ExperimentResult] = []
        for strategy in strategies:
            results.append(self.run_single(strategy, jobs))
        return results

    @staticmethod
    def format_partitions(partitions: List[Partition]) -> str:
        lines = []
        for idx, part in enumerate(sorted(partitions, key=lambda p: p.start)):
            status = "Free" if part.is_free else f"Allocated to {part.job_id}"
            lines.append(
                f"[{idx}] Start: {part.start} KB, Size: {part.size} KB, {status}"
            )
        return "\n".join(lines)

