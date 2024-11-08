import { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import Swal from "sweetalert2";
import "./styles.scss"; 
import { FiUser } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';

export default function FormUser() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {userId} = useParams();
  

  useEffect(()=>{
    if(userId){
      const fetchUser = async () =>{
        try {
          const response = await fetch(`http://localhost:3000/users/${userId}`);
  
          if (!response.ok) {
            throw new Error("Erro na requisição");
          }
  
          const userData = await response.json();
          setNome(userData.nome);
          setEmail(userData.email);
          setCpf(userData.cpf);
          setTelefone(userData.telefone);
          setStatus(userData.status);
        } catch (error) {
          setError(error.message);
        }
      }
      fetchUser();
    }
  }, [userId])

  const showAlert = (message, type = "warning") => {
    Swal.fire({
      icon: type,
      title: "Erro",
      text: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !cpf || !telefone || !status) {
      showAlert("Todos os campos são obrigatórios.");
      return;
    }

    const cpfLimpo = cpf.replace(/[^0-9]/g, "");
    const telefoneLimpo = telefone.replace(/[^0-9]/g, "");

    if (cpfLimpo.length !== 11) {
      showAlert("O CPF deve ter 11 dígitos.");
      return;
    }

    if (telefoneLimpo.length !== 11) {
      showAlert("O telefone deve ter 11 dígitos (incluindo DDD).");
      return;
    }

    const userData = { nome, email, cpf: cpfLimpo, telefone: telefoneLimpo, status };

    try {
      if(userId){
        userData.id = userId;
        await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        });

        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Usuário editado com sucesso!",
        });
      }else{
        await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Usuário criado com sucesso!",
        });
      }

      navigate('/');
    } catch (error) {
      console.error("Erro no envio dos dados para API: ", error);
      showAlert("Erro no envio dos dados para a API. Tente novamente.", "error");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="headerForm">
        <FiUser className="icon" />
        <h2>Painel de clientes</h2>
      </div>
      <hr />
      <h3>Novo usuário</h3>
      <p>Informe os campos a seguir para criar novo usuário:</p>
      <form onSubmit={handleSubmit}>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          type="text"
          name="nome"
          className="inputForm"
          placeholder="Nome"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          className="inputForm"
          placeholder="E-mail"
          required
        />
        <InputMask
          mask="999.999.999-99"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          type="text"
          name="cpf"
          className="inputForm"
          placeholder="CPF"
          required
        />
        <InputMask
          mask="(99) 99999-9999"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          type="text"
          name="telefone"
          className="inputForm"
          placeholder="Telefone"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          name="Status"
          className="inputForm"
          required
        >
          <option value="" hidden>
            Status
          </option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="aguardando ativacao">Aguardando ativação</option>
          <option value="desativado">Desativado</option>
        </select>
        <div className="buttonsForm">
          <button type="submit" className="btnCriar">
            {userId ? "Editar" : "Criar"}
          </button>
          <button type="button" className="btnVoltar" onClick={() => navigate('/')}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
