# frozen_string_literal: true
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: bag.proto

require 'google/protobuf'


descriptor_data = "\n\tbag.proto\x12\x03\x62\x61g\"\xd1\x01\n\x03\x41pp\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x11\n\x04name\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x18\n\x0b\x64\x65scription\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x18\n\x0bpermissions\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x13\n\x06public\x18\x05 \x01(\x08H\x04\x88\x01\x01\x12\x15\n\x08metadata\x18\x06 \x01(\tH\x05\x88\x01\x01\x42\x05\n\x03_idB\x07\n\x05_nameB\x0e\n\x0c_descriptionB\x0e\n\x0c_permissionsB\t\n\x07_publicB\x0b\n\t_metadata\"\x9c\x02\n\x04Item\x12\x11\n\x04name\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x12\n\x05image\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x18\n\x0b\x64\x65scription\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x15\n\x08reaction\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x16\n\tcommodity\x18\x05 \x01(\x08H\x04\x88\x01\x01\x12\x15\n\x08tradable\x18\x06 \x01(\x08H\x05\x88\x01\x01\x12\x13\n\x06public\x18\x07 \x01(\x08H\x06\x88\x01\x01\x12\x15\n\x08metadata\x18\x08 \x01(\tH\x07\x88\x01\x01\x42\x07\n\x05_nameB\x08\n\x06_imageB\x0e\n\x0c_descriptionB\x0b\n\t_reactionB\x0c\n\n_commodityB\x0b\n\t_tradableB\t\n\x07_publicB\x0b\n\t_metadata\"\xb9\x01\n\x05Skill\x12\x11\n\x04name\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x15\n\x08maxLevel\x18\x02 \x01(\x05H\x01\x88\x01\x01\x12\x18\n\x0b\x64\x65scription\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x15\n\x08reaction\x18\x04 \x01(\tH\x03\x88\x01\x01\x12\x15\n\x08metadata\x18\x05 \x01(\tH\x04\x88\x01\x01\x42\x07\n\x05_nameB\x0b\n\t_maxLevelB\x0e\n\x0c_descriptionB\x0b\n\t_reactionB\x0b\n\t_metadata\"n\n\x08Identity\x12\x12\n\x05slack\x18\x01 \x01(\tH\x00\x88\x01\x01\x12 \n\tinventory\x18\x02 \x03(\x0b\x32\r.bag.Instance\x12\x15\n\x08metadata\x18\x03 \x01(\tH\x01\x88\x01\x01\x42\x08\n\x06_slackB\x0b\n\t_metadata\"\xd9\x01\n\x08Instance\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x13\n\x06itemId\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x17\n\nidentityId\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x15\n\x08quantity\x18\x04 \x01(\x05H\x03\x88\x01\x01\x12\x15\n\x08metadata\x18\x05 \x01(\tH\x04\x88\x01\x01\x12\x1c\n\x04item\x18\x06 \x01(\x0b\x32\t.bag.ItemH\x05\x88\x01\x01\x42\x05\n\x03_idB\t\n\x07_itemIdB\r\n\x0b_identityIdB\x0b\n\t_quantityB\x0b\n\t_metadataB\x07\n\x05_item\"\xdd\x01\n\rSkillInstance\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x14\n\x07skillId\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x17\n\nidentityId\x18\x03 \x01(\tH\x02\x88\x01\x01\x12\x12\n\x05level\x18\x04 \x01(\x05H\x03\x88\x01\x01\x12\x15\n\x08metadata\x18\x05 \x01(\tH\x04\x88\x01\x01\x12\x1e\n\x05skill\x18\x06 \x01(\x0b\x32\n.bag.SkillH\x05\x88\x01\x01\x42\x05\n\x03_idB\n\n\x08_skillIdB\r\n\x0b_identityIdB\x08\n\x06_levelB\x0b\n\t_metadataB\x08\n\x06_skill\"\xa0\x02\n\x05Trade\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12 \n\x13initiatorIdentityId\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x1f\n\x12receiverIdentityId\x18\x03 \x01(\tH\x02\x88\x01\x01\x12&\n\x0finitiatorTrades\x18\x04 \x03(\x0b\x32\r.bag.Instance\x12%\n\x0ereceiverTrades\x18\x05 \x03(\x0b\x32\r.bag.Instance\x12\x13\n\x06public\x18\x06 \x01(\x08H\x03\x88\x01\x01\x12\x13\n\x06\x63losed\x18\x07 \x01(\x08H\x04\x88\x01\x01\x42\x05\n\x03_idB\x16\n\x14_initiatorIdentityIdB\x15\n\x13_receiverIdentityIdB\t\n\x07_publicB\t\n\x07_closed\"\xa7\x01\n\nRecipeItem\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x19\n\x0crecipeItemId\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\"\n\nrecipeItem\x18\x03 \x01(\x0b\x32\t.bag.ItemH\x02\x88\x01\x01\x12\x15\n\x08quantity\x18\x04 \x01(\x05H\x03\x88\x01\x01\x42\x05\n\x03_idB\x0f\n\r_recipeItemIdB\r\n\x0b_recipeItemB\x0b\n\t_quantity\"\xe9\x01\n\x06Recipe\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x1f\n\x06inputs\x18\x02 \x03(\x0b\x32\x0f.bag.RecipeItem\x12 \n\x07outputs\x18\x03 \x03(\x0b\x32\x0f.bag.RecipeItem\x12\x1e\n\x05tools\x18\x04 \x03(\x0b\x32\x0f.bag.RecipeItem\x12\x1a\n\x06skills\x18\x05 \x03(\x0b\x32\n.bag.Skill\x12\x13\n\x06public\x18\x06 \x01(\x08H\x01\x88\x01\x01\x12\x18\n\x0b\x64\x65scription\x18\x07 \x01(\tH\x02\x88\x01\x01\x42\x05\n\x03_idB\t\n\x07_publicB\x0e\n\x0c_description\"b\n\x06\x41\x63tion\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x11\n\tlocations\x18\x02 \x03(\t\x12\r\n\x05tools\x18\x03 \x03(\t\x12\x13\n\x06\x62ranch\x18\x04 \x01(\tH\x01\x88\x01\x01\x42\x05\n\x03_idB\t\n\x07_branch\"\xf0\x01\n\x0e\x41\x63tionInstance\x12\x0f\n\x02id\x18\x01 \x01(\x05H\x00\x88\x01\x01\x12\x11\n\x04\x64one\x18\x02 \x01(\x08H\x01\x88\x01\x01\x12\x17\n\nidentityId\x18\x03 \x01(\tH\x02\x88\x01\x01\x12$\n\x08identity\x18\x04 \x01(\x0b\x32\r.bag.IdentityH\x03\x88\x01\x01\x12\x15\n\x08\x61\x63tionId\x18\x05 \x01(\x05H\x04\x88\x01\x01\x12 \n\x06\x61\x63tion\x18\x06 \x01(\x0b\x32\x0b.bag.ActionH\x05\x88\x01\x01\x42\x05\n\x03_idB\x07\n\x05_doneB\r\n\x0b_identityIdB\x0b\n\t_identityB\x0b\n\t_actionIdB\t\n\x07_action\"\xa2\x01\n\x16\x43reateInstancesRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12 \n\tinstances\x18\x03 \x03(\x0b\x32\r.bag.Instance\x12\x12\n\nidentityId\x18\x04 \x01(\t\x12\x11\n\x04show\x18\x05 \x01(\x08H\x00\x88\x01\x01\x12\x11\n\x04note\x18\x06 \x01(\tH\x01\x88\x01\x01\x42\x07\n\x05_showB\x07\n\x05_note\"_\n\x17\x43reateInstancesResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12 \n\tinstances\x18\x02 \x03(\x0b\x32\r.bag.InstanceB\x0b\n\t_response\"\xe5\x01\n\x15\x43reateInstanceRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x0e\n\x06itemId\x18\x03 \x01(\t\x12\x12\n\nidentityId\x18\x04 \x01(\t\x12\x10\n\x08quantity\x18\x05 \x01(\x05\x12\x15\n\x08metadata\x18\x06 \x01(\tH\x00\x88\x01\x01\x12\x13\n\x06public\x18\x07 \x01(\x08H\x01\x88\x01\x01\x12\x11\n\x04show\x18\x08 \x01(\x08H\x02\x88\x01\x01\x12\x11\n\x04note\x18\t \x01(\tH\x03\x88\x01\x01\x42\x0b\n\t_metadataB\t\n\x07_publicB\x07\n\x05_showB\x07\n\x05_note\"o\n\x16\x43reateInstanceResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12$\n\x08instance\x18\x02 \x01(\x0b\x32\r.bag.InstanceH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x0b\n\t_instance\"\xd4\x01\n\x10\x43reateAppRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x0c\n\x04name\x18\x03 \x01(\t\x12\x18\n\x0b\x64\x65scription\x18\x04 \x01(\tH\x00\x88\x01\x01\x12\x18\n\x0bpermissions\x18\x05 \x01(\x05H\x01\x88\x01\x01\x12\x13\n\x06public\x18\x06 \x01(\x08H\x02\x88\x01\x01\x12\x15\n\x08metadata\x18\x07 \x01(\tH\x03\x88\x01\x01\x42\x0e\n\x0c_descriptionB\x0e\n\x0c_permissionsB\t\n\x07_publicB\x0b\n\t_metadata\"u\n\x11\x43reateAppResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1a\n\x03\x61pp\x18\x02 \x01(\x0b\x32\x08.bag.AppH\x01\x88\x01\x01\x12\x10\n\x03key\x18\x03 \x01(\tH\x02\x88\x01\x01\x42\x0b\n\t_responseB\x06\n\x04_appB\x06\n\x04_key\"H\n\x11\x43reateItemRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x17\n\x04item\x18\x03 \x01(\x0b\x32\t.bag.Item\"_\n\x12\x43reateItemResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1c\n\x04item\x18\x02 \x01(\x0b\x32\t.bag.ItemH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x07\n\x05_item\"N\n\x13\x43reateRecipeRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x1b\n\x06recipe\x18\x03 \x01(\x0b\x32\x0b.bag.Recipe\"g\n\x14\x43reateRecipeResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12 \n\x06recipe\x18\x02 \x01(\x0b\x32\x0b.bag.RecipeH\x01\x88\x01\x01\x42\x0b\n\t_responseB\t\n\x07_recipe\"u\n\x12\x43reateTradeRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x11\n\tinitiator\x18\x03 \x01(\t\x12\x10\n\x08receiver\x18\x04 \x01(\t\x12\x13\n\x06public\x18\x05 \x01(\x08H\x00\x88\x01\x01\x42\t\n\x07_public\"c\n\x13\x43reateTradeResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1e\n\x05trade\x18\x02 \x01(\x0b\x32\n.bag.TradeH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x08\n\x06_trade\"N\n\x13\x43reateActionRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x1b\n\x06\x61\x63tion\x18\x03 \x01(\x0b\x32\x0b.bag.Action\"g\n\x14\x43reateActionResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12 \n\x06\x61\x63tion\x18\x02 \x01(\x0b\x32\x0b.bag.ActionH\x01\x88\x01\x01\x42\x0b\n\t_responseB\t\n\x07_action\"E\n\x13ReadIdentityRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x12\n\nidentityId\x18\x03 \x01(\t\"m\n\x14ReadIdentityResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12$\n\x08identity\x18\x02 \x01(\x0b\x32\r.bag.IdentityH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x0b\n\t_identity\"F\n\x14ReadInventoryRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x12\n\nidentityId\x18\x03 \x01(\t\"]\n\x15ReadInventoryResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12 \n\tinventory\x18\x02 \x03(\x0b\x32\r.bag.InstanceB\x0b\n\t_response\"<\n\x0fReadItemRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\r\n\x05query\x18\x03 \x01(\t\"O\n\x10ReadItemResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x17\n\x04item\x18\x02 \x01(\x0b\x32\t.bag.ItemB\x0b\n\t_response\"=\n\x10ReadItemsRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\r\n\x05query\x18\x03 \x01(\t\"Q\n\x11ReadItemsResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x18\n\x05items\x18\x02 \x03(\x0b\x32\t.bag.ItemB\x0b\n\t_response\"E\n\x13ReadInstanceRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x12\n\ninstanceId\x18\x03 \x01(\x05\"m\n\x14ReadInstanceResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12$\n\x08instance\x18\x02 \x01(\x0b\x32\r.bag.InstanceH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x0b\n\t_instance\">\n\x0eReadAppRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x10\n\x08optAppId\x18\x03 \x01(\x05\"Y\n\x0fReadAppResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1a\n\x03\x61pp\x18\x02 \x01(\x0b\x32\x08.bag.AppH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x06\n\x04_app\"?\n\x10ReadTradeRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x0f\n\x07tradeId\x18\x03 \x01(\x05\"a\n\x11ReadTradeResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1e\n\x05trade\x18\x02 \x01(\x0b\x32\n.bag.TradeH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x08\n\x06_trade\"r\n\x12ReadRecipesRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x1a\n\x05query\x18\x03 \x01(\x0b\x32\x0b.bag.Recipe\x12\x16\n\tinclusive\x18\x04 \x01(\x08H\x00\x88\x01\x01\x42\x0c\n\n_inclusive\"W\n\x13ReadRecipesResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1c\n\x07recipes\x18\x02 \x03(\x0b\x32\x0b.bag.RecipeB\x0b\n\t_response\"K\n\x11ReadRecipeRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x1a\n\x05query\x18\x03 \x01(\x0b\x32\x0b.bag.Recipe\"U\n\x12ReadRecipeResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1b\n\x06recipe\x18\x02 \x01(\x0b\x32\x0b.bag.RecipeB\x0b\n\t_response\"K\n\x11ReadActionRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x1a\n\x05query\x18\x03 \x01(\x0b\x32\x0b.bag.Action\"V\n\x12ReadActionResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1c\n\x07\x61\x63tions\x18\x02 \x03(\x0b\x32\x0b.bag.ActionB\x0b\n\t_response\"a\n\x1dUpdateIdentityMetadataRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x12\n\nidentityId\x18\x03 \x01(\t\x12\x10\n\x08metadata\x18\x04 \x01(\t\"w\n\x1eUpdateIdentityMetadataResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12$\n\x08identity\x18\x02 \x01(\x0b\x32\r.bag.IdentityH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x0b\n\t_identity\"\x9b\x01\n\x15UpdateInstanceRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x12\n\ninstanceId\x18\x03 \x01(\x05\x12\x1a\n\x03new\x18\x04 \x01(\x0b\x32\r.bag.Instance\x12\x11\n\x04show\x18\x05 \x01(\x08H\x00\x88\x01\x01\x12\x11\n\x04note\x18\x06 \x01(\tH\x01\x88\x01\x01\x42\x07\n\x05_showB\x07\n\x05_note\"o\n\x16UpdateInstanceResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12$\n\x08instance\x18\x02 \x01(\x0b\x32\r.bag.InstanceH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x0b\n\t_instance\"W\n\x11UpdateItemRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x0e\n\x06itemId\x18\x03 \x01(\t\x12\x16\n\x03new\x18\x04 \x01(\x0b\x32\t.bag.Item\"_\n\x12UpdateItemResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1c\n\x04item\x18\x02 \x01(\x0b\x32\t.bag.ItemH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x07\n\x05_item\"i\n\x10UpdateAppRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x15\n\x08optAppId\x18\x03 \x01(\x05H\x00\x88\x01\x01\x12\x15\n\x03new\x18\x04 \x01(\x0b\x32\x08.bag.AppB\x0b\n\t_optAppId\"[\n\x11UpdateAppResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1a\n\x03\x61pp\x18\x02 \x01(\x0b\x32\x08.bag.AppH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x06\n\x04_app\"q\n\x12UpdateTradeRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x0f\n\x07tradeId\x18\x03 \x01(\x05\x12\x12\n\nidentityId\x18\x04 \x01(\t\x12\x1a\n\x03\x61\x64\x64\x18\x05 \x03(\x0b\x32\r.bag.Instance\"c\n\x13UpdateTradeResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1e\n\x05trade\x18\x02 \x01(\x0b\x32\n.bag.TradeH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x08\n\x06_trade\"]\n\x13UpdateRecipeRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x10\n\x08recipeId\x18\x03 \x01(\x05\x12\x18\n\x03new\x18\x04 \x01(\x0b\x32\x0b.bag.Recipe\"g\n\x14UpdateRecipeResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12 \n\x06recipe\x18\x02 \x01(\x0b\x32\x0b.bag.RecipeH\x01\x88\x01\x01\x42\x0b\n\t_responseB\t\n\x07_recipe\"]\n\x13UpdateActionRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x10\n\x08\x61\x63tionId\x18\x03 \x01(\x05\x12\x18\n\x03new\x18\x04 \x01(\x0b\x32\x0b.bag.Action\"g\n\x14UpdateActionResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12 \n\x06\x61\x63tion\x18\x02 \x01(\x0b\x32\x0b.bag.ActionH\x01\x88\x01\x01\x42\x0b\n\t_responseB\t\n\x07_action\"C\n\x10\x44\x65leteAppRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x13\n\x0b\x64\x65leteAppId\x18\x03 \x01(\x05\"i\n\x11\x44\x65leteAppResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12!\n\ndeletedApp\x18\x02 \x01(\x0b\x32\x08.bag.AppH\x01\x88\x01\x01\x42\x0b\n\t_responseB\r\n\x0b_deletedApp\"G\n\x15\x44\x65leteInstanceRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x12\n\ninstanceId\x18\x03 \x01(\x05\"}\n\x16\x44\x65leteInstanceResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12+\n\x0f\x64\x65letedInstance\x18\x02 \x01(\x0b\x32\r.bag.InstanceH\x01\x88\x01\x01\x42\x0b\n\t_responseB\x12\n\x10_deletedInstance\"@\n\x11\x43loseTradeRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\x12\x0f\n\x07tradeId\x18\x03 \x01(\x05\"\xca\x01\n\x12\x43loseTradeResponse\x12\x15\n\x08response\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x1e\n\x05trade\x18\x02 \x01(\x0b\x32\n.bag.TradeH\x01\x88\x01\x01\x12%\n\tinitiator\x18\x03 \x01(\x0b\x32\r.bag.IdentityH\x02\x88\x01\x01\x12$\n\x08receiver\x18\x04 \x01(\x0b\x32\r.bag.IdentityH\x03\x88\x01\x01\x42\x0b\n\t_responseB\x08\n\x06_tradeB\x0c\n\n_initiatorB\x0b\n\t_receiver\".\n\x10VerifyKeyRequest\x12\r\n\x05\x61ppId\x18\x01 \x01(\x05\x12\x0b\n\x03key\x18\x02 \x01(\t\"\"\n\x11VerifyKeyResponse\x12\r\n\x05valid\x18\x01 \x01(\x08\x32\x94\x0f\n\nBagService\x12<\n\tCreateApp\x12\x15.bag.CreateAppRequest\x1a\x16.bag.CreateAppResponse\"\x00\x12N\n\x0f\x43reateInstances\x12\x1b.bag.CreateInstancesRequest\x1a\x1c.bag.CreateInstancesResponse\"\x00\x12K\n\x0e\x43reateInstance\x12\x1a.bag.CreateInstanceRequest\x1a\x1b.bag.CreateInstanceResponse\"\x00\x12?\n\nCreateItem\x12\x16.bag.CreateItemRequest\x1a\x17.bag.CreateItemResponse\"\x00\x12\x45\n\x0c\x43reateRecipe\x12\x18.bag.CreateRecipeRequest\x1a\x19.bag.CreateRecipeResponse\"\x00\x12\x45\n\x0c\x43reateAction\x12\x18.bag.CreateActionRequest\x1a\x19.bag.CreateActionResponse\"\x00\x12\x42\n\x0b\x43reateTrade\x12\x17.bag.CreateTradeRequest\x1a\x18.bag.CreateTradeResponse\"\x00\x12\x45\n\x0cReadIdentity\x12\x18.bag.ReadIdentityRequest\x1a\x19.bag.ReadIdentityResponse\"\x00\x12H\n\rReadInventory\x12\x19.bag.ReadInventoryRequest\x1a\x1a.bag.ReadInventoryResponse\"\x00\x12\x39\n\x08ReadItem\x12\x14.bag.ReadItemRequest\x1a\x15.bag.ReadItemResponse\"\x00\x12<\n\tReadItems\x12\x15.bag.ReadItemsRequest\x1a\x16.bag.ReadItemsResponse\"\x00\x12\x45\n\x0cReadInstance\x12\x18.bag.ReadInstanceRequest\x1a\x19.bag.ReadInstanceResponse\"\x00\x12\x36\n\x07ReadApp\x12\x13.bag.ReadAppRequest\x1a\x14.bag.ReadAppResponse\"\x00\x12<\n\tReadTrade\x12\x15.bag.ReadTradeRequest\x1a\x16.bag.ReadTradeResponse\"\x00\x12\x42\n\x0bReadRecipes\x12\x17.bag.ReadRecipesRequest\x1a\x18.bag.ReadRecipesResponse\"\x00\x12?\n\nReadRecipe\x12\x16.bag.ReadRecipeRequest\x1a\x17.bag.ReadRecipeResponse\"\x00\x12?\n\nReadAction\x12\x16.bag.ReadActionRequest\x1a\x17.bag.ReadActionResponse\"\x00\x12\x63\n\x16UpdateIdentityMetadata\x12\".bag.UpdateIdentityMetadataRequest\x1a#.bag.UpdateIdentityMetadataResponse\"\x00\x12K\n\x0eUpdateInstance\x12\x1a.bag.UpdateInstanceRequest\x1a\x1b.bag.UpdateInstanceResponse\"\x00\x12?\n\nUpdateItem\x12\x16.bag.UpdateItemRequest\x1a\x17.bag.UpdateItemResponse\"\x00\x12<\n\tUpdateApp\x12\x15.bag.UpdateAppRequest\x1a\x16.bag.UpdateAppResponse\"\x00\x12\x42\n\x0bUpdateTrade\x12\x17.bag.UpdateTradeRequest\x1a\x18.bag.UpdateTradeResponse\"\x00\x12\x45\n\x0cUpdateRecipe\x12\x18.bag.UpdateRecipeRequest\x1a\x19.bag.UpdateRecipeResponse\"\x00\x12\x45\n\x0cUpdateAction\x12\x18.bag.UpdateActionRequest\x1a\x19.bag.UpdateActionResponse\"\x00\x12<\n\tDeleteApp\x12\x15.bag.DeleteAppRequest\x1a\x16.bag.DeleteAppResponse\"\x00\x12K\n\x0e\x44\x65leteInstance\x12\x1a.bag.DeleteInstanceRequest\x1a\x1b.bag.DeleteInstanceResponse\"\x00\x12?\n\nCloseTrade\x12\x16.bag.CloseTradeRequest\x1a\x17.bag.CloseTradeResponse\"\x00\x12<\n\tVerifyKey\x12\x15.bag.VerifyKeyRequest\x1a\x16.bag.VerifyKeyResponse\"\x00\x62\x06proto3"

pool = Google::Protobuf::DescriptorPool.generated_pool

begin
  pool.add_serialized_file(descriptor_data)
rescue TypeError
  # Compatibility code: will be removed in the next major version.
  require 'google/protobuf/descriptor_pb'
  parsed = Google::Protobuf::FileDescriptorProto.decode(descriptor_data)
  parsed.clear_dependency
  serialized = parsed.class.encode(parsed)
  file = pool.add_serialized_file(serialized)
  warn "Warning: Protobuf detected an import path issue while loading generated file #{__FILE__}"
  imports = [
  ]
  imports.each do |type_name, expected_filename|
    import_file = pool.lookup(type_name).file_descriptor
    if import_file.name != expected_filename
      warn "- #{file.name} imports #{expected_filename}, but that import was loaded as #{import_file.name}"
    end
  end
  warn "Each proto file must use a consistent fully-qualified name."
  warn "This will become an error in the next major version."
end

module Bag
  App = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.App").msgclass
  Item = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.Item").msgclass
  Skill = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.Skill").msgclass
  Identity = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.Identity").msgclass
  Instance = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.Instance").msgclass
  SkillInstance = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.SkillInstance").msgclass
  Trade = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.Trade").msgclass
  RecipeItem = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.RecipeItem").msgclass
  Recipe = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.Recipe").msgclass
  Action = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.Action").msgclass
  ActionInstance = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ActionInstance").msgclass
  CreateInstancesRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateInstancesRequest").msgclass
  CreateInstancesResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateInstancesResponse").msgclass
  CreateInstanceRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateInstanceRequest").msgclass
  CreateInstanceResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateInstanceResponse").msgclass
  CreateAppRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateAppRequest").msgclass
  CreateAppResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateAppResponse").msgclass
  CreateItemRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateItemRequest").msgclass
  CreateItemResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateItemResponse").msgclass
  CreateRecipeRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateRecipeRequest").msgclass
  CreateRecipeResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateRecipeResponse").msgclass
  CreateTradeRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateTradeRequest").msgclass
  CreateTradeResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateTradeResponse").msgclass
  CreateActionRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateActionRequest").msgclass
  CreateActionResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CreateActionResponse").msgclass
  ReadIdentityRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadIdentityRequest").msgclass
  ReadIdentityResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadIdentityResponse").msgclass
  ReadInventoryRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadInventoryRequest").msgclass
  ReadInventoryResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadInventoryResponse").msgclass
  ReadItemRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadItemRequest").msgclass
  ReadItemResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadItemResponse").msgclass
  ReadItemsRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadItemsRequest").msgclass
  ReadItemsResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadItemsResponse").msgclass
  ReadInstanceRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadInstanceRequest").msgclass
  ReadInstanceResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadInstanceResponse").msgclass
  ReadAppRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadAppRequest").msgclass
  ReadAppResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadAppResponse").msgclass
  ReadTradeRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadTradeRequest").msgclass
  ReadTradeResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadTradeResponse").msgclass
  ReadRecipesRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadRecipesRequest").msgclass
  ReadRecipesResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadRecipesResponse").msgclass
  ReadRecipeRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadRecipeRequest").msgclass
  ReadRecipeResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadRecipeResponse").msgclass
  ReadActionRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadActionRequest").msgclass
  ReadActionResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.ReadActionResponse").msgclass
  UpdateIdentityMetadataRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateIdentityMetadataRequest").msgclass
  UpdateIdentityMetadataResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateIdentityMetadataResponse").msgclass
  UpdateInstanceRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateInstanceRequest").msgclass
  UpdateInstanceResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateInstanceResponse").msgclass
  UpdateItemRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateItemRequest").msgclass
  UpdateItemResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateItemResponse").msgclass
  UpdateAppRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateAppRequest").msgclass
  UpdateAppResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateAppResponse").msgclass
  UpdateTradeRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateTradeRequest").msgclass
  UpdateTradeResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateTradeResponse").msgclass
  UpdateRecipeRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateRecipeRequest").msgclass
  UpdateRecipeResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateRecipeResponse").msgclass
  UpdateActionRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateActionRequest").msgclass
  UpdateActionResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.UpdateActionResponse").msgclass
  DeleteAppRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.DeleteAppRequest").msgclass
  DeleteAppResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.DeleteAppResponse").msgclass
  DeleteInstanceRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.DeleteInstanceRequest").msgclass
  DeleteInstanceResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.DeleteInstanceResponse").msgclass
  CloseTradeRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CloseTradeRequest").msgclass
  CloseTradeResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.CloseTradeResponse").msgclass
  VerifyKeyRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.VerifyKeyRequest").msgclass
  VerifyKeyResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("bag.VerifyKeyResponse").msgclass
end
