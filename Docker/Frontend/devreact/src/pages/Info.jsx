import { useParams } from "react-router";

export default function Info() {
    const params = useParams()

/*     const url = `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`
        }
    }

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err)); */
    
    return (
        <main>
            <p>{json}</p>
        </main>
  )
}
