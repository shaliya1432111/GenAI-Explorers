import { Navigate, useParams } from 'react-router-dom';

const VideoDetails = () => {
  const { videoId } = useParams();

  return <Navigate to={`/video/${videoId}`} replace />;
};

export default VideoDetails;

// Made with Bob