const FIELD_SIZE = 10000

const BLOCKS_COUNT = Math.ceil(FIELD_SIZE / 1000)
const BLOCKS_SIZE = FIELD_SIZE / BLOCKS_COUNT

const BLOB_RADIUS = 5
const BLOBS_COUNT = BLOCKS_SIZE / 25 // FIELD_SIZE / 1.25

module.exports = {
  FIELD_SIZE,
  BLOCKS_COUNT,
  BLOCKS_SIZE,
  BLOB_RADIUS,
  BLOBS_COUNT
}