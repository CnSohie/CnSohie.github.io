from typing import List

from .experiment import ExperimentManager
from .job_manager import JobManager
from .memory_manager import MemoryManager
from .models import Job
from .strategies import (
    AllocationStrategy,
    BestFitStrategy,
    FirstFitStrategy,
    NextFitStrategy,
    WorstFitStrategy,
)


def create_strategy(choice: str) -> AllocationStrategy:
    mapping = {
        "1": FirstFitStrategy(),
        "2": BestFitStrategy(),
        "3": WorstFitStrategy(),
        "4": NextFitStrategy(),
    }
    return mapping.get(choice, FirstFitStrategy())


def sample_jobs() -> List[Job]:
    return [
        Job("J1", "Compiler", 120),
        Job("J2", "Renderer", 200),
        Job("J3", "Analytics", 60),
        Job("J4", "Logger", 80),
        Job("J5", "TestRunner", 50),
    ]


def prompt_job() -> Job:
    job_id = input("Job ID: ").strip()
    name = input("Job name: ").strip() or job_id
    size = int(input("Required size (KB): ").strip())
    arrival = input("Arrival time (optional, int): ").strip()
    arrival_time = int(arrival) if arrival else None
    return Job(job_id, name, size, arrival_time)


def display_partitions(manager: MemoryManager) -> None:
    print("Current partitions:")
    for idx, part in enumerate(manager.partitions_view()):
        status = "Free" if part.is_free else f"Allocated to {part.job_id}"
        print(f"[{idx}] Start: {part.start} KB, Size: {part.size} KB, {status}")


def allocation_menu() -> str:
    print("Select allocation algorithm:")
    print("1) First Fit  2) Best Fit  3) Worst Fit  4) Next Fit")
    return input("Choice: ").strip()


def run_console(memory_size: int = 512) -> None:
    job_manager = JobManager()
    strategy_choice = allocation_menu()
    strategy = create_strategy(strategy_choice)
    memory_manager = MemoryManager(memory_size, strategy)
    experiment_manager = ExperimentManager(memory_size)

    actions = {
        "1": "Add job",
        "2": "View job queue",
        "3": "Allocate next job",
        "4": "Deallocate job by ID",
        "5": "Show partitions",
        "6": "Load sample workload",
        "7": "Compare algorithms on current queue",
        "8": "Exit",
    }

    while True:
        print("\n=== Dynamic Partition Simulator ===")
        for key, label in actions.items():
            print(f"{key}) {label}")
        choice = input("Select action: ").strip()

        if choice == "1":
            try:
                job_manager.add(prompt_job())
                print("Job added.")
            except ValueError as exc:
                print(f"Error: {exc}")
        elif choice == "2":
            print("Pending jobs:")
            for job in job_manager.pending():
                print(f"- {job.id} ({job.name}): {job.required_size} KB")
        elif choice == "3":
            if not job_manager.pending():
                print("No jobs pending.")
                continue
            strategy_choice = allocation_menu()
            strategy = create_strategy(strategy_choice)
            memory_manager.set_strategy(strategy)
            job = job_manager.pop_next()
            if job and memory_manager.allocate(job):
                print(f"Allocated {job.id} using {strategy.name}.")
            display_partitions(memory_manager)
        elif choice == "4":
            job_id = input("Job ID to deallocate: ").strip()
            memory_manager.deallocate(job_id)
            display_partitions(memory_manager)
        elif choice == "5":
            display_partitions(memory_manager)
            frag, blocks = memory_manager.free_statistics()
            print(f"Free blocks: {blocks}, External fragmentation: {frag} KB")
        elif choice == "6":
            for job in sample_jobs():
                try:
                    job_manager.add(job)
                except ValueError:
                    pass
            print("Loaded sample workload.")
        elif choice == "7":
            jobs = job_manager.pending()
            if not jobs:
                print("No jobs to compare; add or load workload first.")
                continue
            strategies = [
                FirstFitStrategy(),
                BestFitStrategy(),
                WorstFitStrategy(),
                NextFitStrategy(),
            ]
            results = experiment_manager.compare_strategies(strategies, jobs)
            print("\nStrategy comparison (identical workload):")
            for result in results:
                print(result.as_row())
        elif choice == "8":
            print("Exiting simulator.")
            break
        else:
            print("Invalid option.")

