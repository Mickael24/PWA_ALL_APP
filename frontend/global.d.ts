declare module "*.scss" {
  const styles: any;
  export default styles;
}

declare module "*.css" {
  const styles: any;
  export default styles;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

