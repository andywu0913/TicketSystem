module.exports = class {
  constructor(defaultData) {
    this.successful = true;
    this.data = defaultData;
    this.errorFields = [];
    this.errorMsg = '';
  }

  setData(data) {
    this.data = data;
  }

  setError(errorMsg, errorFields = []) {
    this.successful = false;
    this.errorFields = errorFields;
    this.errorMsg = errorMsg;
  }

  toJSON() {
    return {
      successful: this.successful,
      data: this.data,
      error_field: this.errorFields,
      error_msg: this.errorMsg,
    };
  }
};
