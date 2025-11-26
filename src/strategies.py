from abc import ABC, abstractmethod
from typing import List, Optional

from .models import Partition


class AllocationStrategy(ABC):
    name: str

    @abstractmethod
    def select_partition(
        self, partitions: List[Partition], required_size: int
    ) -> Optional[Partition]:
        raise NotImplementedError


class FirstFitStrategy(AllocationStrategy):
    name = "FirstFit"

    def select_partition(
        self, partitions: List[Partition], required_size: int
    ) -> Optional[Partition]:
        for part in partitions:
            if part.can_allocate(required_size):
                return part
        return None


class BestFitStrategy(AllocationStrategy):
    name = "BestFit"

    def select_partition(
        self, partitions: List[Partition], required_size: int
    ) -> Optional[Partition]:
        candidates = [p for p in partitions if p.can_allocate(required_size)]
        if not candidates:
            return None
        return min(candidates, key=lambda p: p.size)


class WorstFitStrategy(AllocationStrategy):
    name = "WorstFit"

    def select_partition(
        self, partitions: List[Partition], required_size: int
    ) -> Optional[Partition]:
        candidates = [p for p in partitions if p.can_allocate(required_size)]
        if not candidates:
            return None
        return max(candidates, key=lambda p: p.size)


class NextFitStrategy(AllocationStrategy):
    name = "NextFit"

    def __init__(self) -> None:
        self._cursor_start = 0

    def reset_cursor(self) -> None:
        self._cursor_start = 0

    def select_partition(
        self, partitions: List[Partition], required_size: int
    ) -> Optional[Partition]:
        if not partitions:
            return None

        sorted_parts = sorted(partitions, key=lambda p: p.start)
        first_pass = [p for p in sorted_parts if p.start >= self._cursor_start]
        search_order = first_pass + [p for p in sorted_parts if p.start < self._cursor_start]

        for part in search_order:
            if part.can_allocate(required_size):
                self._cursor_start = part.start + part.size
                return part
        return None

