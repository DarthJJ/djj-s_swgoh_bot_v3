export class Serializable {
  fillFromJSON(jsonObj: object) {
    // var jsonObj = JSON.parse(json);
    for (var propName in jsonObj) {
      this[propName as keyof typeof jsonObj] = jsonObj[propName as keyof typeof jsonObj] ?? "";
    }
    return this;
  }
}
