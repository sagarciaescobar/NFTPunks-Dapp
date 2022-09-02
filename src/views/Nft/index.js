import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";
import {
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import PunkCard from "../../components/punk-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useNftPunksData } from "../../hooks/useNFTPunksData";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Nft = () => {
  const { search } = useLocation();
  const { active, library } = useWeb3React();
  const [submited, setSubmited] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [address, setAddress] = useState(
    new URLSearchParams(search).get("address")
  );
  const { punks, loading } = useNftPunksData({
    owner: submited && validAddress ? address : null,
  });
  const navigate = useNavigate();

  const handleAddressChange = ({ target: { value } }) => {
    setAddress(value);
    setSubmited(false);
    setValidAddress(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (address) {
      const isValid = library.utils.isAddress(address);
      setValidAddress(isValid);
      setSubmited(true);
      if (isValid) {
        navigate(`/nft?address=${address}`);
      }
    } else {
      navigate("/nft");
    }
  };

  if (!active) return <RequestAccess />;
  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={false}
              value={address ?? ""}
              onChange={handleAddressChange}
              placeholder="Busca por direccion"
            />
            <InputRightElement w="4rem" mr="0.75rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {submit && !validAddress && (
            <FormHelperText>Direccion invalida</FormHelperText>
          )}
        </FormControl>
      </form>
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
