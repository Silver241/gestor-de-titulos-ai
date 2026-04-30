import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  useCategorias,
  useCreateCategoria,
  useUpdateCategoria,
  useDeleteCategoria,
  useOrgaos,
  useCreateOrgao,
  useUpdateOrgao,
  useDeleteOrgao,
  useProgramas,
  useCreatePrograma,
  useUpdatePrograma,
  useDeletePrograma,
  useUtilizadores,
  useCreateUtilizador,
  useUpdateUtilizador,
  useDeleteUtilizador,
} from "@/hooks/useApi";
import type { Categoria, Orgao, Programa, Utilizador } from "@/types";

const Admin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administração</h1>
        <p className="text-muted-foreground">Gerir todas as entidades do sistema</p>
      </div>

      <Tabs defaultValue="categorias" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="orgaos">Órgãos</TabsTrigger>
          <TabsTrigger value="programas">Programas</TabsTrigger>
          <TabsTrigger value="utilizadores">Utilizadores</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias">
          <CategoriasTab />
        </TabsContent>

        <TabsContent value="orgaos">
          <OrgaosTab />
        </TabsContent>

        <TabsContent value="programas">
          <ProgramasTab />
        </TabsContent>

        <TabsContent value="utilizadores">
          <UtilizadoresTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CategoriasTab = () => {
  const { data: categorias = [] } = useCategorias();
  const createCategoria = useCreateCategoria();
  const updateCategoria = useUpdateCategoria();
  const deleteCategoria = useDeleteCategoria();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [editingItem, setEditingItem] = useState<Categoria | null>(null);

  const handleCreate = async () => {
    await createCategoria.mutateAsync({ nome });
    setNome("");
    setIsCreateOpen(false);
  };

  const handleOpenEdit = (item: Categoria) => {
    setEditingItem(item);
    setNome(item.nome);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    await updateCategoria.mutateAsync({
      id: editingItem.id,
      data: { nome },
    });

    setEditingItem(null);
    setNome("");
    setIsEditOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Categorias</CardTitle>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <Button onClick={handleCreate} className="w-full">
                  Criar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCategoria.mutateAsync(item.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <Button onClick={handleUpdate} className="w-full">
                Guardar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const OrgaosTab = () => {
  const { data: orgaos = [] } = useOrgaos();
  const createOrgao = useCreateOrgao();
  const updateOrgao = useUpdateOrgao();
  const deleteOrgao = useDeleteOrgao();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [editingItem, setEditingItem] = useState<Orgao | null>(null);

  const handleCreate = async () => {
    await createOrgao.mutateAsync({ nome });
    setNome("");
    setIsCreateOpen(false);
  };

  const handleOpenEdit = (item: Orgao) => {
    setEditingItem(item);
    setNome(item.nome);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    await updateOrgao.mutateAsync({
      id: editingItem.id,
      data: { nome },
    });

    setEditingItem(null);
    setNome("");
    setIsEditOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Órgãos</CardTitle>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Órgão</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <Button onClick={handleCreate} className="w-full">
                  Criar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgaos.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteOrgao.mutateAsync(item.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Órgão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <Button onClick={handleUpdate} className="w-full">
                Guardar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const ProgramasTab = () => {
  const { data: programas = [] } = useProgramas();
  const { data: orgaos = [] } = useOrgaos();
  const createPrograma = useCreatePrograma();
  const updatePrograma = useUpdatePrograma();
  const deletePrograma = useDeletePrograma();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [edicao, setEdicao] = useState<"bloco" | "peca">("bloco");
  const [orgaoId, setOrgaoId] = useState("");
  const [editingItem, setEditingItem] = useState<Programa | null>(null);

  const handleCreate = async () => {
    await createPrograma.mutateAsync({
      nome,
      edicao,
      orgao: parseInt(orgaoId),
    });
    setNome("");
    setEdicao("bloco");
    setOrgaoId("");
    setIsCreateOpen(false);
  };

  const handleOpenEdit = (item: Programa) => {
    setEditingItem(item);
    setNome(item.nome);
    setEdicao(item.edicao as "bloco" | "peca");
    setOrgaoId(item.orgao.toString());
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    await updatePrograma.mutateAsync({
      id: editingItem.id,
      data: {
        nome,
        edicao,
        orgao: parseInt(orgaoId),
      },
    });

    setEditingItem(null);
    setNome("");
    setEdicao("bloco");
    setOrgaoId("");
    setIsEditOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Programas</CardTitle>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Programa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>

                <div>
                  <Label>Edição</Label>
                  <Select value={edicao} onValueChange={(v) => setEdicao(v as "bloco" | "peca")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bloco">Bloco</SelectItem>
                      <SelectItem value="peca">Peça</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Órgão</Label>
                  <Select value={orgaoId} onValueChange={setOrgaoId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orgaos.map((o) => (
                        <SelectItem key={o.id} value={o.id.toString()}>
                          {o.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreate} className="w-full">
                  Criar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Edição</TableHead>
              <TableHead>Órgão</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programas.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.edicao}</TableCell>
                <TableCell>{item.orgao_nome}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePrograma.mutateAsync(item.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Programa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>

              <div>
                <Label>Edição</Label>
                <Select value={edicao} onValueChange={(v) => setEdicao(v as "bloco" | "peca")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bloco">Bloco</SelectItem>
                    <SelectItem value="peca">Peça</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Órgão</Label>
                <Select value={orgaoId} onValueChange={setOrgaoId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orgaos.map((o) => (
                      <SelectItem key={o.id} value={o.id.toString()}>
                        {o.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleUpdate} className="w-full">
                Guardar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const UtilizadoresTab = () => {
  const { data: utilizadores = [] } = useUtilizadores();
  const createUtilizador = useCreateUtilizador();
  const updateUtilizador = useUpdateUtilizador();
  const deleteUtilizador = useDeleteUtilizador();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const [tipo, setTipo] = useState<"admin" | "editor">("editor");
  const [editingItem, setEditingItem] = useState<Utilizador | null>(null);

  const resetForm = () => {
    setNome("");
    setPassword("");
    setTipo("editor");
    setEditingItem(null);
  };

  const handleOpenCreate = (open: boolean) => {
    setIsCreateOpen(open);
    if (open) {
      resetForm();
    }
  };

  const handleCreate = async () => {
    await createUtilizador.mutateAsync({ nome, password, tipo });
    resetForm();
    setIsCreateOpen(false);
  };

  const handleOpenEdit = (item: Utilizador) => {
    setEditingItem(item);
    setNome(item.nome);
    setPassword("");
    setTipo(item.tipo as "admin" | "editor");
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    await updateUtilizador.mutateAsync({
      id: editingItem.id,
      data: {
        nome,
        tipo,
        ...(password ? { password } : {}),
      },
    });

    resetForm();
    setIsEditOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Utilizadores</CardTitle>

          <Dialog open={isCreateOpen} onOpenChange={handleOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Utilizador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome</Label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>

                <div>
                  <Label>Role</Label>
                  <Select
                    value={tipo}
                    onValueChange={(value) => setTipo(value as "admin" | "editor")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleCreate} className="w-full">
                  Criar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {utilizadores.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteUtilizador.mutateAsync(item.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Utilizador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>

              <div>
                <Label>Role</Label>
                <Select
                  value={tipo}
                  onValueChange={(value) => setTipo(value as "admin" | "editor")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nova Password (opcional)</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button onClick={handleUpdate} className="w-full">
                Guardar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Admin;