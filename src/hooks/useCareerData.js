import { useEffect, useState } from "react";
import { loadCareerDataset } from "../services/dataLoader";

function useCareerData(datasetName) {
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function run() {
      setLoading(true);
      try {
        const data = await loadCareerDataset(datasetName);
        if (active) setDataset(data);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [datasetName]);

  return { dataset, loading, error };
}

export default useCareerData;
