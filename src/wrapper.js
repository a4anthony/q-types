import * as components from "./index";

const install = (instance) => {
  for (let componentKey in components) {
    instance.use(components[componentKey]);
  }
};

export default install;

export * from "./";
