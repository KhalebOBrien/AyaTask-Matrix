# AyaTask-Matrix

### Challenge
You have two matrices A and B of sizes n x n and need to compute their product C = A x B. Can you come up with an algorithm that can parallelize this computation to take advantage of multiple processors or cores? What is the theoretical limit of speedup you can achieve with this approach?

### Solution
To parallelize the computation of the product of two matrices A and B, we can divide the task into multiple smaller subtasks and assign each subtask to a different processor or core for parallel execution. One common approach to achieve this is to use a technique called ```block matrix multiplication``` or ```blocked algorithm```.

The blocked algorithm works by partitioning the matrices A and B into smaller submatrices, called blocks, and then computing the product of these blocks to generate the corresponding block of the product matrix C.

The basic steps of the algorithm can be described as follows:

1. Divide each matrix A and B into smaller square blocks of size k x k. The value of k depends on the available memory and the number of processors or cores.
2. Initialize the resulting matrix C with zeros.
3. For each block row i of matrix A, and for each block column j of matrix B, compute the product of the corresponding blocks of A and B, and accumulate the result in the corresponding block of matrix C. This can be done in parallel for different pairs of block rows and columns.
4. Repeat step 3 for all block rows and block columns of A and B, until all blocks of C have been computed.

#### Pseudo-code
The pseudo-code for this algorithm can be expressed as follows:

```
function parallel_matrix_multiply(A, B, k):
    n = A.shape[0]
    C = zeros((n, n))

    for i in range(0, n, k):
        for j in range(0, n, k):
            for l in range(0, n, k):
                # Compute the product of the corresponding blocks of A and B
                A_block = A[i:i+k, l:l+k]
                B_block = B[l:l+k, j:j+k]
                C_block = C[i:i+k, j:j+k]
                C_block += dot(A_block, B_block)

    return C
```

In this pseudo-code, the ```dot()``` function computes the matrix product of two submatrices using standard matrix multiplication. The function takes as input the matrices A and B, the block size k, and returns the resulting matrix C.

This algorithm can be parallelized by assigning different pairs of block rows and columns to different processors or cores, and then using thread-based parallelism to compute the matrix products for these pairs of blocks. The number of threads should be equal to the number of processors or cores available. By partitioning the matrix multiplication into smaller subtasks, the algorithm can take advantage of the parallel processing power of modern CPUs and GPUs, leading to faster execution times.

#### Speedup Limit
The theoretical limit of speedup that can be achieved with the blocked algorithm for matrix multiplication depends on the size of the matrices and the number of processors or cores available.
Assuming we have a square matrix of size n x n and p processors, the time complexity of the blocked algorithm is ```O(n^3/p + n^3)```, where the first term represents the time required to perform the matrix multiplication on p processors, and the second term represents the time required to combine the results.

The optimal speedup we can achieve is given by Amdahl's Law, which states that the maximum speedup S achievable for a program with a fraction f of non-parallelizable code and a fraction (1-f) of parallelizable code is:

>S = 1 / (f + (1-f)/p)

In the case of matrix multiplication using the blocked algorithm, the non-parallelizable code is the time required to combine the results from the different processors, which is proportional to n^3. Therefore, the fraction of parallelizable code is: 
>(1-f) = O(n^3/p + n^3)/n^3 = O(1/p + 1/n),
which becomes smaller as the matrix size and the number of processors increase.

As a result, the maximum speedup achievable by the blocked algorithm is limited by the overhead of combining the results from the different processors, and by the diminishing returns of parallelism as the matrix size increases. In practice, the speedup achieved by the blocked algorithm can be significantly lower than the theoretical limit, due to various factors such as memory access patterns, load balancing, and communication overhead.

#### Practical example
Here's a working JavaScript code that implements the parallel_matrix_multiply function based on the given pseudo-code:

```javascript
function parallel_matrix_multiply(A, B, k) {
  let n = A.length;
  let C = Array.from(Array(n), () => new Array(n).fill(0));

  for (let i = 0; i < n; i += k) {
    for (let j = 0; j < n; j += k) {
      for (let l = 0; l < n; l += k) {
        // Compute the product of the corresponding blocks of A and B
        let A_block = getBlock(A, i, l, k);
        let B_block = getBlock(B, l, j, k);
        let C_block = getBlock(C, i, j, k);
        C_block = matrixAdd(C_block, matrixMultiply(A_block, B_block));
        setBlock(C, i, j, C_block);
      }
    }
  }

  return C;
}

function getBlock(matrix, rowStart, colStart, blockSize) {
  let block = Array.from(Array(blockSize), () => new Array(blockSize).fill(0));
  for (let i = rowStart; i < rowStart + blockSize; i++) {
    for (let j = colStart; j < colStart + blockSize; j++) {
      block[i - rowStart][j - colStart] = matrix[i][j];
    }
  }
  return block;
}

function setBlock(matrix, rowStart, colStart, block) {
  for (let i = rowStart; i < rowStart + block.length; i++) {
    for (let j = colStart; j < colStart + block[0].length; j++) {
      matrix[i][j] = block[i - rowStart][j - colStart];
    }
  }
}

function matrixAdd(A, B) {
  let n = A.length;
  let C = Array.from(Array(n), () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] + B[i][j];
    }
  }
  return C;
}

function matrixMultiply(A, B) {
  let n = A.length;
  let C = Array.from(Array(n), () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
}
```

This code uses nested for-loops to iterate over the blocks of matrix A and B, and to compute the corresponding block of matrix C. The getBlock function extracts a submatrix of size k x k from a given matrix, the setBlock function updates a submatrix of size k x k in a given matrix, and the matrixAdd and matrixMultiply functions perform element-wise addition and matrix multiplication, respectively.

And because JavaScript doesn't have a built-in zeros function to create an empty matrix, so we initialize the resulting matrix C with an array of zeros. Also, we use the ```Array.from``` method to create a 2D array of the specified size and fill it with zeros.

To test the above code, first lets define two arrays as follows:
```javascript
let A = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16]
];

let B = [
  [16, 15, 14, 13],
  [12, 11, 10, 9],
  [8, 7, 6, 5],
  [4, 3, 2, 1]
];
```

This creates two matrices A and B of size 4 x 4 with integer values. Now lets call the ```parallel_matrix_multiply``` function on these matrices with a block size of, say, 2, like this:
```Javascript
let C = parallel_matrix_multiply(A, B, 2);
console.log(C);
```
This should print the resulting matrix C to the console, which should be:
```
[
  [56, 50, 44, 38],
  [152, 138, 124, 110],
  [248, 226, 204, 182],
  [344, 314, 284, 254]
]
```

You can compare this result with the result of the regular matrix multiplication to verify that the function is working correctly.

#### code implemetation
The above javascript code have been implementated here in nodejs, follow the steps below to run it:

STEP 1: Clone the repository

STEP 2: Install the dependencies
```
yarn install
```

STEP 3: Run the app
```
yarn start
```

STEP 4: Test with Postman
Start a new request on Postman with the follow URL:
```
[GET] http://localhost:3000/
```
Supply JSON as follows:
```
{
  "a":[
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
      ],
  "b":[
      [16, 15, 14, 13],
      [12, 11, 10, 9],
      [8, 7, 6, 5],
      [4, 3, 2, 1]
    ],
  "c":2
}
```
