import React, { useState, useEffect } from 'react'
import axios from './axios'
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'
const base_url = 'https://image.tmdb.org/t/p/original/'
function Row({ title, fetchUrl, isLargePoster }) {
  const [movies, setMovies] = useState([])
  const [trailerUrl, setTrailerUrl] = useState('')

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl)
      setMovies(request.data.results)
      return request
    }
    fetchData()
  }, [fetchUrl])

  const opts = {
    height: '400',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }
  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl('')
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || ' ')
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search)
          setTrailerUrl(urlParams.get('v'))
        })
        .catch((error) => console.log(error))
    }
  }
  // const handleClick = (movie) => {
  //   if (trailerUrl) {
  //     setTrailerUrl('')
  //   } else {
  //     // const url = '?listType=search&list='
  //     const moviename =
  //       movie?.title || movie?.name || movie?.original_name || ''
  //     const Moviename = moviename.replace(/ /gi, '+')
  //     const url = '/c/Netflix/?listType=search&list='
  //     setTrailerUrl(url + Moviename)
  //   }

  return (
    <div className='row'>
      <h2>{title}</h2>

      <div className='row-posters'>
        {movies.map((movie) => {
          const video = movie.video
          if (video != null)
            return (
              <img
                key={movie.id}
                onClick={() => handleClick(movie)}
                className={`row-poster ${isLargePoster && 'row-poster-large'}`}
                src={`${base_url}${
                  isLargePoster ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.title}
              />
            )
        })}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  )
}

export default Row
