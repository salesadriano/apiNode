import Modelo from "../helpers/Modelo";

interface iRelacionamento {
  sons: Modelo;
  attributeName: string;
  relationshipType: string;
  localKey?: string | undefined;
  foreingKey?: string | undefined;
}

export default iRelacionamento;