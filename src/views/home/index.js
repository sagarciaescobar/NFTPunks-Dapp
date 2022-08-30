import React, {useCallback, useEffect, useState} from "react";
import { useWeb3React } from "@web3-react/core";
import { useNFTPunks } from "../../hooks/useNFTPunks";

export const Home = () => {
  const {active} = useWeb3React();
  const [maxSupply,setMaxSupply] = useState(123);
  
  const nftPunks = useNFTPunks();


  const getMaxSupply = useCallback(async ()=>{
    if(nftPunks){
      const result = await nftPunks.methods.maxSupply().call();
      setMaxSupply(result);
    }
  },[nftPunks])

  useEffect(()=>{
    getMaxSupply();
  },[getMaxSupply])

  if(!active) return "conecta tu wallet"

  return (<p>Max Supply: {maxSupply}</p>)
};
