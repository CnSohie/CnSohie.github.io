from typing import List, Optional, Tuple

from .models import Job, Partition
from .strategies import AllocationStrategy, NextFitStrategy


class MemoryManager:
    def __init__(self, total_size: int, strategy: AllocationStrategy) -> None:
        if total_size <= 0:
            raise ValueError("total_size must be positive")
        self.total_size = total_size
        self.partitions: List[Partition] = [Partition(0, 0, total_size, True, None)]
        self.strategy: AllocationStrategy = strategy
        self._next_partition_id = 1

    def set_strategy(self, strategy: AllocationStrategy) -> None:
        self.strategy = strategy
        if isinstance(strategy, NextFitStrategy):
            strategy.reset_cursor()

    def _free_partitions(self) -> List[Partition]:
        return [p for p in self.partitions if p.is_free]

    def allocate(self, job: Job) -> bool:
        free_parts = self._free_partitions()
        target = self.strategy.select_partition(free_parts, job.required_size)
        if target is None:
            print(
                f"Allocation failed for Job {job.id}: no suitable free partition; "
                "consider deallocating or merging." 
            )
            return False

        if target.size == job.required_size:
            target.is_free = False
            target.job_id = job.id
        else:
            self._split_partition(target, job)

        self._sort_partitions()
        return True

    def _split_partition(self, partition: Partition, job: Job) -> None:
        allocated = Partition(partition.id, partition.start, job.required_size, False, job.id)
        remaining = Partition(
            self._next_partition_id,
            partition.start + job.required_size,
            partition.size - job.required_size,
            True,
            None,
        )
        self._next_partition_id += 1

        self.partitions.remove(partition)
        self.partitions.extend([allocated, remaining])

    def deallocate(self, job_id: str) -> bool:
        for part in self.partitions:
            if not part.is_free and part.job_id == job_id:
                part.is_free = True
                part.job_id = None
                self.merge_free_partitions()
                return True
        print(f"No partition found for Job {job_id}.")
        return False

    def merge_free_partitions(self) -> None:
        self._sort_partitions()
        merged: List[Partition] = []
        for part in self.partitions:
            if merged and merged[-1].is_free and part.is_free:
                merged[-1].size += part.size
            else:
                merged.append(part)
        self.partitions = merged

    def partitions_view(self) -> List[Partition]:
        return list(self.partitions)

    def free_statistics(self) -> Tuple[int, int]:
        free_blocks = [p for p in self.partitions if p.is_free]
        total_free = sum(p.size for p in free_blocks)
        return total_free, len(free_blocks)

    def utilization(self) -> float:
        total_free, _ = self.free_statistics()
        return (self.total_size - total_free) / self.total_size

    def _sort_partitions(self) -> None:
        self.partitions.sort(key=lambda p: p.start)

