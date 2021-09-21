import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { getTopTracks} from '../spotify';
import { SectionWrapper, TimeRangeButtons, TrackList } from '../components';

const TopArtist = () => {
    const [userTopTracks, setUserTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState("long")

    useEffect(() => {

        const fetchData = async () => {
            const topTracks = await getTopTracks(`${activeRange}_term`);
            setUserTopTracks(topTracks.data)
        }

        catchErrors(fetchData());
    }, [activeRange])

    return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {userTopTracks && userTopTracks.items && (
            <TrackList tracks={userTopTracks.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopArtist;