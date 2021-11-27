declare module "*.vue" {
  import { defineComponent } from "vue"
  const Component: ReturnType<typeof defineComponent>
  export default Component
}

declare module "*.js"
declare module "*.ts"

declare module "koa-bodyparser"
declare module "koaBodyParser"
declare module "koa2-cors"

declare module "Gganbu/*"

declare module "*/cli/child"
