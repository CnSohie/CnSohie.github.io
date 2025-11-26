import argparse

from src.experiment import ExperimentManager
from src.memory_manager import MemoryManager
from src.strategies import BestFitStrategy, FirstFitStrategy, NextFitStrategy, WorstFitStrategy
from src.ui import run_console, sample_jobs


def run_demo(memory_size: int) -> None:
    jobs = sample_jobs()
    strategies = [FirstFitStrategy(), BestFitStrategy(), WorstFitStrategy(), NextFitStrategy()]
    experiment_manager = ExperimentManager(memory_size)

    print(f"演示模式：内存 {memory_size} KB，运行示例作业负载……")
    results = experiment_manager.compare_strategies(strategies, jobs)
    for result in results:
        print(result.as_row())

    # 使用首次适应策略逐步展示分配过程
    print("\n首次适应策略的逐步分配：")
    manager = MemoryManager(memory_size, FirstFitStrategy())
    for job in jobs:
        success = manager.allocate(job)
        status = "成功" if success else "失败"
        print(f"作业 {job.id} ({job.required_size} KB): {status}")
        for idx, part in enumerate(manager.partitions_view()):
            label = "空闲" if part.is_free else f"已分配给 {part.job_id}"
            print(f"  [{idx}] 起始: {part.start} KB, 大小: {part.size} KB, {label}")
        print("---")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="动态分区分配模拟器")
    parser.add_argument(
        "--mode",
        choices=["console", "demo"],
        default="demo",
        help="console: 交互式模拟器；demo: 运行示例负载",
    )
    parser.add_argument(
        "--memory",
        type=int,
        default=512,
        help="总内存大小（KB，默认 512）",
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

