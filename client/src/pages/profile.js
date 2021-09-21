import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getCurrentUserProfile, getCurrentUserPlaylists, getTopArtists, getTopTracks } from '../spotify';
import { StyledHeader } from '../styles';
import { SectionWrapper, ArtistsGrid, TrackList, PlaylistsGrid, Loader } from '../components';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [userTopArtists, setUserTopArtists] = useState(null);
  const [userTopTracks, setUserTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);

      const UserPlaylists = await getCurrentUserPlaylists();
      setPlaylists(UserPlaylists.data);

      const UserTopArtists = await getTopArtists();
      setUserTopArtists(UserTopArtists.data);

      const userTopTracks = await getTopTracks();
      setUserTopTracks(userTopTracks.data);
    };

    catchErrors(fetchData());

  }, []);

  return (
    <>
      {profile && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images.length > 0 && profile.images[0].url && (
                <img className="header__img" src={profile.images[0].url} alt="Avatar"/>
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  <span>
                    {profile.followers.total} Follower{profile.followers.total !== 1 ? 's' : ''}
                  </span>
                  { playlists &&
                    <span>
                    {playlists.total} Playlist{playlists.total > 1 ? 's' : ''}
                    </span>
                  }
                </p>
              </div>
            </div>
          </StyledHeader>
          {userTopArtists && userTopTracks && playlists ? (
            <main>
              <SectionWrapper title="Top artists this month" seeAllLink="/top-artists">
                <ArtistsGrid artists={userTopArtists.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Top tracks this month" seeAllLink="/top-tracks">
                <TrackList tracks={userTopTracks.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Playlists" seeAllLink="/playlists">
                <PlaylistsGrid playlists={playlists.items.slice(0, 10)} />
              </SectionWrapper>
            </main>
          ) : <Loader />
          }
        </>
      )}
    </>
  )
};

export default Profile;