import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";
import headerImg from './assets/img/header-img.svg'

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "Your Contract Address Here";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>


      <div className="App">

        <div className="AccountNav">
          <p style={{ color: "white" }}>
            Account : {account ? account : "Not connected"}
          </p>
        </div>

        <div className="flex">
          <div className="left">
            <h1 style={{ color: "white" }}>CryptoDocs</h1>
            <p className="content">here you can upload your document securely</p>

            <FileUpload
              account={account}
              provider={provider}
              contract={contract}
            ></FileUpload>
            <Display contract={contract} account={account}></Display>
            {!modalOpen && (
              <button className="share" onClick={() => setModalOpen(true)}>
                Share
              </button>
            )}
            {modalOpen && (
              <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
            )}
            
          </div>

        </div>

        <div className="right">
        <img className="header-img" src={headerImg}/>
        </div>
        <div>
          <h1>
          </h1>
        </div>
      </div>


    </>
  );
}

export default App;
