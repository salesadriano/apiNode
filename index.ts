import StartUp from "./startUp";

let port = process.env.PORT || "3050";

StartUp.app.listen(port, () => {
  console.log(`servidor executando em http://localhost:${port} `);
});
