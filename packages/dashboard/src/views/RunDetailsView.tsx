import React from 'react';
import { RunDetails } from '../components/run/details';
import { RunSummary } from '../components/run/summary';
import { useGetRunQuery } from '../generated/graphql';
import { useApolloClient } from '@apollo/react-hooks';

export function RunDetailsView({
  match: {
    params: { id }
  }
}) {
  const apollo = useApolloClient();

  const { loading, error, data } = useGetRunQuery({
    variables: { runId: id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;
  if (!data) return <p>No data</p>;

  if (!data.run) {
    apollo.writeData({
      data: {
        navStructure: [
          {
            __typename: 'NavStructureItem',
            label: 'Non-existing run',
            link: `run/missing`
          }
        ]
      }
    });
    return 'Cannot find this run does not exist';
  }

  apollo.writeData({
    data: {
      navStructure: [
        {
          __typename: 'NavStructureItem',
          label: data.run!.meta!.ciBuildId,
          link: `run/${data.run!.runId}`
        }
      ]
    }
  });

  return (
    <>
      <RunSummary run={data.run} />
      <RunDetails run={data.run} />
    </>
  );
}
