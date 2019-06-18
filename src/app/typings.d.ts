declare var ActiveXObject: ActiveXObject;
  interface ActiveXObject {
  new (type: string): ActiveXObject;
  SendKeys(key: string): void;
}

