import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBorderAll,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import fileTypeIcons from './icons';

function Hello() {
  const [path, setPath] = useState('C:/');
  const [files, setFiles] = useState([]);
  const [listView, setListView] = useState(true);

  useEffect(() => {
    getFiles();
  }, [path]);

  const handleFileClick = (
    event: any,
    fileName: string,
    fileType: string,
    filePath: string,
  ) => {
    if (event.detail == 2 && fileType === '') {
      setPath((prevPath) => prevPath + fileName + '/');
    }
  };

  function getFiles() {
    window.electron.ipcRenderer.once('read-folder', (arg) => {
      setFiles(
        (arg as any[]).map((f) => {
          return (
            <File
              key={f.name}
              name={f.name}
              type={f.type}
              path={f.path}
              handleClick={handleFileClick}
            />
          );
        }) as any,
      );
    });

    window.electron.ipcRenderer.sendMessage('read-folder', [path]);
  }

  function goUpOne() {
    const newPath = path.split('/');
    const folder = newPath.pop();
    console.log(newPath, newPath.pop());
    setPath(newPath.join('/') + '/');
  }

  return (
    <div className="explorer-window">
      <header className="explorer-header">
        <button onClick={() => goUpOne()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <input type="text" value={path} readOnly />
        <button onClick={() => setListView(!listView)}>
          <FontAwesomeIcon icon={listView ? faList : faBorderAll} />
        </button>
      </header>

      <section
        className={'explorer ' + (listView ? 'explorer-list' : 'explorer-grid')}
      >
        {files}
      </section>
    </div>
  );
}

function File({
  name,
  type,
  path,
  handleClick,
}: {
  name: string;
  type: string;
  path: string;
  handleClick: any;
}) {
  return (
    <div className="file" onClick={(ev) => handleClick(ev, name, type, path)}>
      <FontAwesomeIcon className="file-icon" icon={fileTypeIcons(type)} />

      <span
        className="file-name"
        data-tooltip-content={name}
        data-tooltip-id={`tooltip${name}`}
        data-tooltip-place="bottom"
        data-tooltip-variant="dark"
        data-tooltip-delay-show={500}
      >
        {name}
      </span>
      <Tooltip id={`tooltip${name}`} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
