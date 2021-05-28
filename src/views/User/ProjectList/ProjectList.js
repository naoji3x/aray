import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';

import { asyncListAll } from 'utils/graph';
import { listProjects } from './ProjectListQueries';
import ProjectCard from 'components/ProjectCard';
import DataJoinEditorInput from 'components/DataJoinEditor/DataJoinEditorInput';

export default function UserProjectList() {
  const { t } = useTranslation();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [filteredProjects, setFilteredProjects] = useState([]);

  const handleFilter = (key) => (values) => {
    console.log(key, values);
    setFilters({
      ...filters,
      [key]: values,
    });
  };

  useEffect(() => {
    const filtered = projects.filter((project) => {
      let shouldDisplay = true;
      Object.keys(filters).forEach((key) => {
        const targetValues = filters[key];
        if (targetValues.length === 0) {
          return;
        }
        const result = project[key].items.some((item) => {
          return targetValues.includes(item[Object.keys(item)[0]].label);
        });
        if (!result) {
          shouldDisplay = false;
        }
      });

      return shouldDisplay;
    });

    setFilteredProjects(filtered);
  }, [filters, projects]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      // TODO: indexing and pagination
      const data = await asyncListAll(listProjects);
      setProjects(data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Container maxWidth={false}>
      <Card style={{ padding: 16, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom align="center" style={{ marginTop: 16 }}>
              {t('projectList_projects')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <DataJoinEditorInput
              title={t('projectList_searchByTags')}
              mode={'project-tag'}
              joinData={[]}
              onChange={handleFilter('tags')}
              onUpdateOptions={()=>{}}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataJoinEditorInput
              title={t('projectList_searchByKeywords')}
              mode={'project-keyword'}
              joinData={[]}
              onChange={handleFilter('keywords')}
              onUpdateOptions={()=>{}}
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataJoinEditorInput
              title={t('projectList_searchByNeeds')}
              mode={'project-need'}
              joinData={[]}
              onChange={handleFilter('needs')}
              onUpdateOptions={()=>{}}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      </Card>
      <Grid container spacing={2}>
        {filteredProjects.map((item, index)=>(
          <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
            <ProjectCard project={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

UserProjectList.propTypes = {};
