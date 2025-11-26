import argparse

from src.experiment import ExperimentManager
from src.memory_manager import MemoryManager
from src.strategies import BestFitStrategy, FirstFitStrategy, NextFitStrategy, WorstFitStrategy
from src.ui import run_console, sample_jobs


def run_demo(memory_size: int) -> None:
    jobs = sample_jobs()
    strategies = [FirstFitStrategy(), BestFitStrategy(), WorstFitStrategy(), NextFitStrategy()]
    experiment_manager = ExperimentManager(memory_size)

    print(f"Running demo with memory size {memory_size} KB and sample workload...")
    results = experiment_manager.compare_strategies(strategies, jobs)
    for result in results:
        print(result.as_row())

    # Show one step-by-step allocation using First Fit
    print("\nStep-by-step First Fit allocation:")
    manager = MemoryManager(memory_size, FirstFitStrategy())
    for job in jobs:
        success = manager.allocate(job)
        status = "SUCCESS" if success else "FAILED"
        print(f"Job {job.id} ({job.required_size} KB): {status}")
        for idx, part in enumerate(manager.partitions_view()):
            label = "Free" if part.is_free else f"Allocated to {part.job_id}"
            print(f"  [{idx}] Start: {part.start} KB, Size: {part.size} KB, {label}")
        print("---")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Dynamic partition allocation simulator")
    parser.add_argument(
        "--mode",
        choices=["console", "demo"],
        default="demo",
        help="console: interactive simulator; demo: run sample workload",
    )
    parser.add_argument(
        "--memory",
        type=int,
        default=512,
        help="Total memory size in KB (default: 512)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.mode == "console":
        run_console(memory_size=args.memory)
    else:
        run_demo(memory_size=args.memory)


if __name__ == "__main__":
    main()

