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