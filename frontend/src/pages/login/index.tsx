import { useRouter } from "next/router";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 06defc32-8a22-4152-8d15-834acf645687",
      },
      body: JSON.stringify({ username: name, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } else {
      toast.error(`Erro ao efetuar login`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <main className="flex flex-1 flex-col h-screen w-screen justify-center items-center bg-background-900">
      <p className="font-sans text-2xl text-fontColor-900">LOGIN</p>
      <form
        className="flex flex-1 flex-col max-h-[30vh] w-[35vw] justify-center items-center bg-background-800"
        onSubmit={handleLogin} // Handle submit on enter key
      >
        <p className="font-sans text-1xl text-fontColor-900">
          Digite um nome de usuário
        </p>
        <input
          className="font-sans text-lg text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-xl p-2 w-5/6"
          type="text"
          placeholder=""
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <p className="font-sans mt-2 text-1xl text-fontColor-900">
          Digite sua senha
        </p>
        <input
          className="font-sans text-lg text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-xl p-2 w-5/6"
          type="password"
          placeholder=""
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="flex w-full justify-center mt-4">
          <button
            type="submit" // Use submit type to trigger form submission on Enter
            disabled={password === "" || name === ""}
            className="w-32 mt-2 font-sans text-center p-2 bg-violet-500 rounded-xl hover:opacity-80"
          >
            CONFIRMAR
          </button>
        </div>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </main>
  );
}
