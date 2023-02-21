export const parallel_matrix_multiply = (A, B, k) => {
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
};

const getBlock = (matrix, rowStart, colStart, blockSize) => {
  let block = Array.from(Array(blockSize), () => new Array(blockSize).fill(0));
  for (let i = rowStart; i < rowStart + blockSize; i++) {
    for (let j = colStart; j < colStart + blockSize; j++) {
      block[i - rowStart][j - colStart] = matrix[i][j];
    }
  }
  return block;
}

const setBlock = (matrix, rowStart, colStart, block) => {
  for (let i = rowStart; i < rowStart + block.length; i++) {
    for (let j = colStart; j < colStart + block[0].length; j++) {
      matrix[i][j] = block[i - rowStart][j - colStart];
    }
  }
}

const matrixAdd = (A, B) => {
  let n = A.length;
  let C = Array.from(Array(n), () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] + B[i][j];
    }
  }
  return C;
}

const matrixMultiply = (A, B) => {
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
