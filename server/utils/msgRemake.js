function msgRemake(err) {
  if (err.code == 11000) {
    return `Duplicate ${Object.keys(err.keyPattern)[0]} '${
      Object.values(err.keyValue)[0]
    }' is not allowed, please kindly use another one.`;
  }
  return err.message;
}
module.exports = msgRemake;
