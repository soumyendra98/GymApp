import BeatLoader from "react-spinners/BeatLoader";

export default function Spinner(props) {
  const { loading } = props;

  return <BeatLoader color="#EB5531" loading={loading} />;
}
