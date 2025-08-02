# Pets Vaccination Problem Solution (TypeScript)

## Problem Statement

**Challenge**: Safely vaccinate 3 Chihuahuas and 3 cats while preventing attacks

### Constraints
1. **Surgery Limit**: Only 2 animals can be vaccinated simultaneously
2. **Post-Surgery Rule**: After vaccination, 1 animal returns to waiting room, 1 goes to recovery
3. **Safety Constraint**: Chihuahuas attack cats if they outnumber cats in any room
4. **Goal**: All animals must be vaccinated before completion

---

## Algorithm Analysis & Solution Strategy

### Problem Classification
This is a **state-space search problem**, similar to the classic "Missionaries and Cannibals" puzzle.

- **State Space**: All possible distributions of animals across 3 locations
- **Search Method**: Depth-First Search (DFS) with memoization
- **Constraint Satisfaction**: Safety rule validation at each state

### Technical Architecture

```
src/
├── constants/
│   └── app.constants.ts          # Configuration and display constants
├── types/
│   ├── animal.types.ts           # Animal-related type definitions
│   ├── solver.interface.ts       # Core solver interface definition
│   ├── state.interface.ts        # State interface definition
│   └── solution.types.ts         # Solution-related type definitions
├── models/
│   └── vaccination.state.ts      # State representation and validation
├── solvers/
│   └── vaccination.solver.ts     # Core search algorithm implementation
├── utils/
│   └── output.formatter.ts       # Console output and formatting
├── errors/
│   └── vaccination.errors.ts     # Custom error definitions
└── main.ts                       # Application orchestration and entry point
```

---

## Step-by-Step Algorithm Breakdown

### Phase 1: State Representation

**VaccinationState Class** (`src/models/vaccination.state.ts`)

```typescript
class VaccinationState {
  waitingChihuahuas: number     // Animals in waiting room
  waitingCats: number
  recoveryChihuahuas: number    // Animals in recovery room  
  recoveryCats: number
  vaccinatedChihuahuas: number  // Total vaccinated count
  vaccinatedCats: number
}
```

**Why this structure?**
- **Immutable Design**: Readonly properties prevent accidental state mutations
- **Complete Information**: Every animal's location is explicitly tracked
- **Validation Ready**: All data needed for constraint checking is present

### Phase 2: Constraint Validation

**Safety Rule Implementation** (`isValid()` method)

```typescript
public isValid(): boolean {
  // Rule: Chihuahuas attack cats if they outnumber cats in any room
  // Exception: If no cats present, any number of chihuahuas is safe
  
  // Check waiting room
  if (this.waitingCats > 0 && this.waitingChihuahuas > this.waitingCats) {
    return false;
  }
  
  // Check recovery room  
  if (this.recoveryCats > 0 && this.recoveryChihuahuas > this.recoveryCats) {
    return false;
  }
  
  return true;
}
```

**Critical Insight**: The safety constraint has an important exception - if there are no cats in a room, any number of chihuahuas is safe. This exception is crucial for finding the solution path.

### Phase 3: State Transition Generation

**Move Generation Logic** (`getNextStates()` method)

**Step 3.1: Select Animals for Surgery**
```typescript
// Try all combinations of exactly 2 animals from waiting room
for (let chihuahuasToVaccinate = 0; chihuahuasToVaccinate <= Math.min(2, this.waitingChihuahuas); chihuahuasToVaccinate++) {
  const catsToVaccinate = 2 - chihuahuasToVaccinate;
  // ... validation logic
}
```

**Step 3.2: Distribute Post-Surgery**
```typescript
// Exactly 1 animal returns to waiting, 1 goes to recovery
for (let chihuahuasToWaiting = 0; chihuahuasToWaiting <= chihuahuasToVaccinate; chihuahuasToWaiting++) {
  for (let catsToWaiting = 0; catsToWaiting <= catsToVaccinate; catsToWaiting++) {
    if (chihuahuasToWaiting + catsToWaiting !== 1) continue; // Must be exactly 1
    // ... create new state
  }
}
```

**Why this approach?**
- **Exhaustive Search**: All possible legal moves are generated
- **Constraint Filtering**: Only safe states are added to search tree
- **Optimal Solutions**: DFS finds the first valid solution path

### Phase 4: Search Algorithm

**Depth-First Search Implementation** (`src/solvers/vaccination.solver.ts`)

```typescript
private _depthFirstSearch(state: VaccinationState, path: SolutionStep[]): SolutionStep[] | null {
  // Base case: Goal reached
  if (state.isGoal()) return path;
  
  // Memoization: Avoid cycles  
  const stateKey = state.getKey();
  if (this._visited.has(stateKey)) return null;
  this._visited.add(stateKey);
  
  // Recursive exploration
  for (const { state: nextState, action } of state.getNextStates()) {
    const solution = this._depthFirstSearch(nextState, [...path, { state: nextState, action }]);
    if (solution) return solution; // First solution found
  }
  
  return null; // No solution in this branch
}
```

**Algorithm Characteristics**:
- **Time Complexity**: O(b^d) where b = branching factor, d = solution depth
- **Space Complexity**: O(s) where s = number of unique states visited
- **Memoization**: Prevents infinite loops and improves performance
- **Early Termination**: Returns first solution found (optimal for this problem)

---

## Solution Path Analysis

### The Winning Strategy

**Initial State**: `Waiting: 3C 3cat | Recovery: 0C 0cat | Vaccinated: 0C 0cat`

**Step 1**: Vaccinate 1 chihuahua + 1 cat → Return 1 cat to waiting
- **Result**: `Waiting: 2C 3cat | Recovery: 1C 0cat | Vaccinated: 1C 1cat`
- **Why safe?**: Waiting room has equal numbers, recovery room has no cats

**Step 2**: Vaccinate 1 chihuahua + 1 cat → Return 1 cat to waiting  
- **Result**: `Waiting: 1C 3cat | Recovery: 2C 0cat | Vaccinated: 2C 2cat`
- **Why safe?**: Cats outnumber chihuahuas in waiting, no cats in recovery

**Step 3**: Vaccinate 1 chihuahua + 1 cat → Return 1 cat to waiting
- **Result**: `Waiting: 0C 3cat | Recovery: 3C 0cat | Vaccinated: 3C 3cat`
- **Why safe?**: No chihuahuas in waiting, no cats in recovery

**Final State**: All animals vaccinated successfully!

### Key Strategic Insights

1. **Recovery Room Strategy**: Keep recovery room cat-free to safely house multiple chihuahuas
2. **Waiting Room Balance**: Always return cats to maintain safe ratios
3. **Progressive Reduction**: Each step reduces waiting room animals while maintaining safety
4. **Optimal Path Length**: 3 steps is the minimum possible solution

---

## Performance Metrics

- **States Explored**: 4 (highly efficient due to memoization)
- **Solution Steps**: 3 (optimal length)
- **Memory Usage**: O(1) for state storage, O(4) for memoization
- **Execution Time**: < 1ms (deterministic algorithm)

---

## How to Run

### Local Development
```bash
cd "Q.1 - Pets Love"
npm install
npm run dev          # TypeScript development mode
npm run build        # Production build  
npm start           # Run compiled JavaScript
```

### Docker Deployment (Recommended)
```bash
# Automated testing
.\test-docker.bat    # Windows
./test-docker.sh     # Linux/macOS

# Manual Docker commands
docker build -t pets-vaccination .
docker run --rm pets-vaccination
```

### Expected Output
```
Pets Vaccination Problem Solver
============================================================
Initial state: 3 Chihuahuas and 3 cats in waiting room
Goal: Vaccinate all animals safely without attacks

Game Rules:
• Only 2 animals can go to surgery at the same time
• After vaccination: 1 returns to waiting room, 1 goes to recovery room
• Chihuahuas attack cats if they outnumber cats in any room
• All animals must be vaccinated before going home

[SUCCESS] Solution found!

Step 0: Waiting: 3C 3cat | Recovery: 0C 0cat | Vaccinated: 0C 0cat
Step 1: Vaccinate 1 chihuahua(s) and 1 cat(s). Return 0 chihuahua(s) and 1 cat(s) to waiting room.
        Waiting: 2C 3cat | Recovery: 1C 0cat | Vaccinated: 1C 1cat
Step 2: Vaccinate 1 chihuahua(s) and 1 cat(s). Return 0 chihuahua(s) and 1 cat(s) to waiting room.
        Waiting: 1C 3cat | Recovery: 2C 0cat | Vaccinated: 2C 2cat
Step 3: Vaccinate 1 chihuahua(s) and 1 cat(s). Return 0 chihuahua(s) and 1 cat(s) to waiting room.
        Waiting: 0C 3cat | Recovery: 3C 0cat | Vaccinated: 3C 3cat

[SUCCESS] All animals have been safely vaccinated!

Search Statistics:
• States explored: 4
• Solution steps: 3
============================================================
[SUCCESS] Application completed successfully!
```

---

## Technical Design Decisions

### Why Depth-First Search?
- **Memory Efficient**: O(d) space complexity vs O(b^d) for BFS
- **Early Solution**: Finds any valid solution quickly
- **Stack-Based**: Natural recursion fits the problem structure

### Why Immutable State Objects?
- **Thread Safety**: No concurrent modification issues
- **Debugging**: State history is preserved
- **Functional Programming**: Pure functions enable better testing

### Why Memoization?
- **Cycle Prevention**: Avoids infinite loops in state space
- **Performance**: Eliminates redundant computation
- **Scalability**: Essential for larger problem instances

### Why TypeScript?
- **Type Safety**: Catches errors at compile time
- **Interface Contracts**: Clear API boundaries between modules
- **Modern Tooling**: Excellent debugging and refactoring support
- **Docker Compatible**: Compiles to standard Node.js JavaScript
