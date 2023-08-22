import Header from "../components/header/Header";
import UploadMain from "./UploadMain";

export default function Upload() {
  //uploadthing does not like server components (Header)
  return (
    <>
      <Header />
      <UploadMain />
    </>
  );
}
