import { useNavigate } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { defaultSearchParams, type SearchParams } from "../../types/Search";
import type { z } from "zod";
import { EntityForm } from "./EntityForm";
import { EntityTable } from "./EntityTable";
import type EntityService from "../../services/entity/EntityService";
import { EntityServiceRegistry } from "../../services/entity/EntityServiceRegistry";
import type { Entity } from "../../types/Entity";
import ButtonText from "../ui/ButtonText";

export const EntityInfo = <
  T extends Entity,
  TSchema extends z.ZodType<Omit<T, 'id'>>
>(params: {
  entityId: string;
  service: EntityService<T, TSchema>;
}) => {
  const navigate = useNavigate();

  const metadata = params.service.metadata;
  const service = params.service;

  const { data, isPending } = service.useGet(params.entityId);

  const [edit, setEdit] = useState(false);

  const loadingElement = <div>Loading ...</div>;

  const updateMutation = service.useUpdate();

  const deleteMutation = service.useDelete(() => {
    navigate({ to: metadata.indexPagePrefix });
  });

  return (
    <div className="flex flex-col md:flex-row flex-wrap">
      <div className="flex flex-col justify-start items-center border-b md:border-b-0 md:border-r">
        {isPending || data === undefined ? (
          loadingElement
        ) : (
          <div className="flex flex-col items-start gap-4 md:pr-4 w-full">
            <div className="md:pr-4 gap-4 w-full flex items-center justify-between">
              <ButtonText
                props={{
                  onClick: () => navigate({ to: metadata.indexPagePrefix }),
                }}
              >
                ← Back
              </ButtonText>
              {edit ? (
                <ButtonText
                  props={{
                    onClick: () => setEdit(false),
                  }}
                >
                  Close edit
                </ButtonText>
              ) : (
                <ButtonText
                  props={{
                    onClick: () => setEdit(true),
                  }}
                >
                  Edit ...
                </ButtonText>
              )}
            </div>
            <div className="text-lg fw-600">
              {`${metadata.singular} ${params.entityId}`}
            </div>
            <div className="w-full">
              <EntityForm
                edit={edit}
                entity={data}
                service={service}
                onSubmit={(newFields) =>
                  updateMutation.mutate({
                    id: params.entityId,
                    data: newFields,
                  })
                }
              />
            </div>
            {edit && (
              <div className="self-end m-t-4 flex flex-col justify-end gap-4">
                <ButtonText
                  type="danger"
                  props={{
                    onClick: () => deleteMutation.mutate(data.id),
                    className: "self-end",
                  }}
                >
                  {`Delete ${metadata.singular}...`}
                </ButtonText>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="pl-4 pt-4 w-full flex-1 min-w-0">
        {metadata.relations && metadata.relations.length ? (
          metadata.relations.map((relation) => {
            const [searchParams, setSearchParams] =
              useState<SearchParams>(defaultSearchParams);
            return (
              <Fragment key={`relation_${relation.apiPrefix}`}>
                <h2 className="mb-4 text-xl fw-600">{relation.label}</h2>
                <EntityTable
                  traverse
                  key={`relation_${relation.label}`}
                  searchParams={{ value: searchParams, set: setSearchParams }}
                  service={EntityServiceRegistry[relation.apiPrefix] as any}
                  relationFilter={{
                    key: relation.fkField,
                    value: params.entityId,
                  }}
                  edit
                />
              </Fragment>
            );
          })
        ) : (
          <>
            <h2 className="mb-4 text-xl fw-600">No references</h2>
            <div>...</div>
          </>
        )}
      </div>
    </div>
  );
};
