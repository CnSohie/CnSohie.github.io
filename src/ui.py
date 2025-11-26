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
        Job("J1", "编译器", 120),
        Job("J2", "渲染器", 200),
        Job("J3", "分析服务", 60),
        Job("J4", "日志记录", 80),
        Job("J5", "测试执行", 50),
    ]


def prompt_job() -> Job:
    job_id = input("作业 ID: ").strip()
    name = input("作业名称: ").strip() or job_id
    size = int(input("需求大小 (KB): ").strip())
    arrival = input("到达时间（可选，整数）: ").strip()
    arrival_time = int(arrival) if arrival else None
    return Job(job_id, name, size, arrival_time)


def display_partitions(manager: MemoryManager) -> None:
    print("当前分区状态：")
    for idx, part in enumerate(manager.partitions_view()):
        status = "空闲" if part.is_free else f"已分配给 {part.job_id}"
        print(f"[{idx}] 起始: {part.start} KB, 大小: {part.size} KB, {status}")


def allocation_menu() -> str:
    print("选择分配算法：")
    print("1) 首次适应  2) 最佳适应  3) 最坏适应  4) 循环首次适应")
    return input("输入选项: ").strip()


def run_console(memory_size: int = 512) -> None:
    job_manager = JobManager()
    strategy_choice = allocation_menu()
    strategy = create_strategy(strategy_choice)
    memory_manager = MemoryManager(memory_size, strategy)
    experiment_manager = ExperimentManager(memory_size)

    actions = {
        "1": "添加作业",
        "2": "查看作业队列",
        "3": "分配下一个作业",
        "4": "按 ID 回收作业",
        "5": "显示分区",
        "6": "加载示例负载",
        "7": "比较当前队列的算法",
        "8": "退出",
    }

    while True:
        print("\n=== 动态分区分配模拟器 ===")
        for key, label in actions.items():
            print(f"{key}) {label}")
        choice = input("请选择操作: ").strip()

        if choice == "1":
            try:
                job_manager.add(prompt_job())
                print("作业已添加。")
            except ValueError as exc:
                print(f"错误: {exc}")
        elif choice == "2":
            print("待分配作业：")
            for job in job_manager.pending():
                print(f"- {job.id} ({job.name}): {job.required_size} KB")
        elif choice == "3":
            if not job_manager.pending():
                print("当前无待分配作业。")
                continue
            strategy_choice = allocation_menu()
            strategy = create_strategy(strategy_choice)
            memory_manager.set_strategy(strategy)
            job = job_manager.pop_next()
            if job and memory_manager.allocate(job):
                print(f"已使用 {strategy.name} 分配作业 {job.id}。")
            display_partitions(memory_manager)
        elif choice == "4":
            job_id = input("要回收的作业 ID: ").strip()
            memory_manager.deallocate(job_id)
            display_partitions(memory_manager)
        elif choice == "5":
            display_partitions(memory_manager)
            frag, blocks = memory_manager.free_statistics()
            print(f"空闲分区数: {blocks}, 外部碎片: {frag} KB")
        elif choice == "6":
            for job in sample_jobs():
                try:
                    job_manager.add(job)
                except ValueError:
                    pass
            print("已加载示例负载。")
        elif choice == "7":
            jobs = job_manager.pending()
            if not jobs:
                print("没有可比较的作业，请先添加或加载负载。")
                continue
            strategies = [
                FirstFitStrategy(),
                BestFitStrategy(),
                WorstFitStrategy(),
                NextFitStrategy(),
            ]
            results = experiment_manager.compare_strategies(strategies, jobs)
            print("\n策略对比（相同作业队列）：")
            for result in results:
                print(result.as_row())
        elif choice == "8":
            print("退出模拟器。")
            break
        else:
            print("无效的选项。")

