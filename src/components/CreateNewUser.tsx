import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { useUserActions } from "../Hooks/useUserActions";


export function CreateNewUser() {
  const [ result, setResult ] = useState<string>("")
  const { addUser } = useUserActions();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      github: formData.get("github") as string,
    };

    if (!data.name || !data.email || !data.github) {
      setResult("ko");
      return;
    }

    addUser(data);
    setResult("ok");
    form.reset();
  }

  return (
    <Card className="mt-4">
      <Title>Crear nuevo usuario</Title>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <TextInput
          name="name"
          placeholder="Nombre"
        />
        <TextInput
          name="email"
          placeholder="Email"
        />
        <TextInput
          name="github"
          placeholder="Github"
        />
        <Button className="mt-4" type="submit">Crear</Button>
        <span>
            {result === "ok" && <Badge color="green">Usuario creado correctamente</Badge>}
            {result === "ko" && <Badge color="red">Falta Información</Badge>}
        </span>
      </form>
    </Card>
  );
}