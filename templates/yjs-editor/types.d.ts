declare module "*.module.css" {
  declare const styles: Record<string, string>;
  export = styles;
}
