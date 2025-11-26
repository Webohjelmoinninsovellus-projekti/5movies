export default function Reviews() {

  useEffect(() => {
    async function loadMovies() {
      const results = await fetchDiscovery("movie", 1);
      setMovies(results);
    }
    loadMovies();
  }, []);

  return (

  );
}
