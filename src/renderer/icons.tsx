import {
  faFile,
  faFolder,
  faFileWord,
  faFilePdf,
  faFileZipper,
  faFileVideo,
  faFilePowerpoint,
  faFileLines,
  faFileImage,
  faFileCsv,
  faFileCode,
  faFileAudio,
} from '@fortawesome/free-solid-svg-icons';

export default function fileTypeIcons(type: string) {
  switch (type) {
    case '':
      return faFolder;
    case '.doc':
    case '.docx':
    case '.odt':
    case '.rtf':
      return faFileWord;
    case '.pdf':
      return faFilePdf;
    case '.zip':
    case '.rar':
    case '.7z':
    case '.tar':
      return faFileZipper;
    case '.mp4':
      return faFileVideo;
    case '.ppt':
    case '.pptx':
    case '.odp':
      return faFilePowerpoint;
    case '.txt':
      return faFileLines;
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
      return faFileImage;
    case '.csv':
      return faFileCsv;
    case '.js':
    case '.ts':
    case '.jsx':
    case '.tsx':
    case '.c':
    case '.cpp':
    case '.java':
    case '.py':
    case '.html':
    case '.css':
    case '.scss':
    case '.sass':
    case '.less':
    case '.php':
    case '.go':
    case '.rb':
    case '.swift':
      return faFileCode;
    case '.mp3':
    case '.wav':
    case '.flac':
      return faFileAudio;
    default:
      return faFile;
  }
}
