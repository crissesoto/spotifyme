import { StyledGrid } from '../styles';

const ArtistsGrid = ({ artists }) => (
  <>
    {artists && artists.length ? (
      <StyledGrid type="artist">
        {artists.map((artist, i) => (
          <li className="grid__item" key={i}>
            <div className="grid__item__inner">
              {artist.images.length > 0 && artist.images[0] && (
                <div className="grid__item__img">
                  <img src={artist.images[0].url} alt={artist.name} />
                </div>
              )}
              {artist.images.length < 1 && (
                <div className="grid__item__img">
                  <p className="grid__item__label">No image</p>
                </div>
              )}
              <h3 className="grid__item__name overflow-ellipsis">{artist.name}</h3>
              <p className="grid__item__label">Artist</p>
            </div>
          </li>
        ))}
      </StyledGrid>
    ) : (
      <p className="empty-notice">No artists available</p>
    )}
  </>
);

export default ArtistsGrid;