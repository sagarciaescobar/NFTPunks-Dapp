import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";
import { Grid } from "@chakra-ui/react";
import PunkCard from "../../components/punk-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useNftPunksData } from "../../hooks/useNFTPunksData";

export const Nft = () => {
  const { active } = useWeb3React();
  const { punks, loading } = useNftPunksData();
  if (!active) return <RequestAccess />;
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks.map(({ name, image, tokenId }) => {
            return (
              <Link key={tokenId} to={`/nft/${tokenId}`}>
                <PunkCard tokenId={tokenId} image={image} name={name} />
              </Link>
            );
          })}
        </Grid>
      )}
    </>
  );
};
