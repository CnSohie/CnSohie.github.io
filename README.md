# Dynamic Partition Allocation Simulation

This repository implements a console-based simulator for dynamic partition memory allocation. It models contiguous physical memory, supports multiple allocation strategies (First Fit, Best Fit, Worst Fit, Next Fit), and provides experiment tooling to compare strategies under the same job workload.

## Features
- Configurable memory size with partition splitting and coalescing.
- Allocation and deallocation by job ID.
- Strategies: First Fit, Best Fit, Worst Fit, and Next Fit.
- Experiment runner that reports fragmentation, free partition count, and utilization.
- Interactive console menu and quick demo mode.

## Setup
Requires Python 3.10+.

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
```

## Running
- **Demo mode (default):** runs a sample workload across all strategies and shows a detailed First Fit trace.

```bash
python main.py --memory 512
```

- **Interactive console:** allows adding jobs, allocating/deallocating, and comparing algorithms.

```bash
python main.py --mode console --memory 512
```

## Repository Structure
- `main.py`: entry point with demo and CLI launcher.
- `src/models.py`: data classes for partitions, jobs, and experiment results.
- `src/strategies.py`: allocation strategies implementing a common interface.
- `src/memory_manager.py`: core memory operations, partition splitting, and merging.
- `src/job_manager.py`: in-memory job queue management.
- `src/experiment.py`: experiment orchestration and statistics.
- `src/ui.py`: console menu and sample job definitions.
- `docs/design.md`: full design document, diagrams, and database schema documentation.

## Example Output (demo)
```
Running demo with memory size 512 KB and sample workload...
FirstFit   | Allocated:  5 | Failed:  0 | Free blocks:  1 | Fragmentation:  2 KB | Utilization: 99.6%
BestFit    | Allocated:  5 | Failed:  0 | Free blocks:  1 | Fragmentation:  2 KB | Utilization: 99.6%
WorstFit   | Allocated:  5 | Failed:  0 | Free blocks:  1 | Fragmentation:  2 KB | Utilization: 99.6%
NextFit    | Allocated:  5 | Failed:  0 | Free blocks:  1 | Fragmentation:  2 KB | Utilization: 99.6%
```
