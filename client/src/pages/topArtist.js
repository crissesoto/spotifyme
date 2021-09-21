import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopArtists} from '../spotify';
import { SectionWrapper, ArtistsGrid, TimeRangeButtons } from '../components';

const TopArtist = () => {
    const [userTopArtists, setUserTopArtists] = useState(null);
    const [activeRange, setActiveRange] = useState("long")

    useEffect(() => {

        const fetchData = async () => {
            const topArtists = await getTopArtists(`${activeRange}_term`);
            setUserTopArtists(topArtists.data)
        }

        catchErrors(fetchData());
    }, [activeRange])

    return (
    <main>
      <SectionWrapper title="Top Artists" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {userTopArtists && userTopArtists.items && (
          <ArtistsGrid artists={userTopArtists.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopArtist;