cmake_minimum_required(VERSION 3.0)

project(LuminideStart)

if(WIN32)
    set_property(SOURCE windows.cpp PROPERTY VS_GLOBAL_ApplicationIcon "LuminideStart.ico")
    add_executable(LuminideStart windows.cpp)
else()
    add_executable(LuminideStart linux.cpp)
endif()
