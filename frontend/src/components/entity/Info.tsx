import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { defaultSearchParams, type SearchParams } from "../../types/Search";
import type { Entity } from "../../entities/Entity";
import type { z } from "zod";
import ButtonText from "../../ui/ButtonText";
import { EntityForm } from "./Form";
import { EntityTable } from "./Table";
import type EntityService from "../../entities/EntityService";
import { EntityServiceRegistry } from "../../entities/EntityServiceRegistry";

export const EntityInfo = <
  T extends Entity,
  TSchema extends z.ZodType<Omit<T, 'id'>>
>(params: {
  entityId: string;
  service: EntityService<T, TSchema>;
}) => {
  const router = useRouter();

  const metadata = params.service.metadata;
  const service = params.service;

  const { data, isPending } = service.useGet(params.entityId);

  const [edit, setEdit] = useState(false);

  const loadingElement = <div>Loading ...</div>;

  const updateMutation = service.useUpdate();

  const deleteMutation = service.useDelete(() => {
    router.navigate({ to: metadata.apiPrefix + "s" });
  });

  return (
    <div className="flex flex-col md:flex-row md:max-w-screen-lg md:w-auto">
      <div className="flex flex-col justify-start items-center p-8 p-t-4 border-b md:border-b-0 md:border-r">
        {isPending || data === undefined ? (
          loadingElement
        ) : (
          <>
            <div className="mb-4 w-full flex items-center justify-between">
              <ButtonText
                props={{
                  onClick: () => router.history.go(-1)
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
          </>
        )}
      </div>
      <div className="w-full p-4">
        {metadata.relations &&
          metadata.relations.length &&
          metadata.relations.map((relation) => {
            const [searchParams, setSearchParams] =
              useState<SearchParams>(defaultSearchParams);
            return (
              <div>
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
              </div>
            );
          })}
      </div>
    </div>
  );
};
